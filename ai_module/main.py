import base64
import math
import os

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from ultralytics import YOLO

app = FastAPI(title="Borsch AI Vision Service")

# Load the model ONCE at server startup
try:
    print("[INFO] Initializing YOLO model...")

    # Get the directory where main.py is located
    # and construct the path to fridge_recognition_v0.1.pt
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, "models", "fridge_recognition_v0.1.pt")

    model = YOLO(model_path)
    class_names = model.names
    print(f"[INFO] Model loaded successfully from {model_path}!")
except Exception as e:
    print(f"[ERROR] Failed to load model: {e}")
    model = None


@app.get("/")
def read_root():
    print("[INFO] Health check endpoint accessed.")
    return {"service": "AI Vision Service", "status": "running"}


@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    """
    Receives an image, runs YOLO inference, returns a list of ingredients
    and the image with bounding boxes (in Base64 format).
    """
    print(f"[INFO] Received prediction request. Filename: {file.filename}")

    if model is None:
        print("[ERROR] Prediction failed: Model is not loaded.")
        return JSONResponse(status_code=500, content={"error": "Model is not loaded"})

    try:
        # 1. Read file from HTTP request into memory
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            print("[ERROR] Invalid image format received.")
            return JSONResponse(status_code=400, content={"error": "Invalid image format"})

        print("[INFO] Image decoded successfully. Running YOLO inference...")

        # 2. Run YOLO (stream=False because it's a single image, not video)
        results = model(img, conf=0.3)

        detected_ingredients = []
        box_count = 0

        # 3. Process results and draw bounding boxes
        for r in results:
            boxes = r.boxes
            for box in boxes:
                box_count += 1

                # Coordinates
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

                # Confidence and Class
                conf = math.ceil((box.conf[0] * 100)) / 100
                cls = int(box.cls[0])
                current_class = class_names[cls]

                # Add to the list for the backend
                detected_ingredients.append({"ingredient": current_class, "confidence": conf})

                # Draw bounding box on the image (for frontend)
                cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                label = f"{current_class} {conf}"
                cv2.putText(
                    img,
                    label,
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (255, 255, 255),
                    2,
                )

        print(f"[INFO] Inference complete. Detected {box_count} items.")

        # 4. Encode the modified image to Base64
        # This allows passing the image in JSON format
        _, buffer = cv2.imencode(".jpg", img)
        img_base64 = base64.b64encode(buffer).decode("utf-8")

        print("[INFO] Successfully encoded image to Base64. Returning response.")

        # 5. Return the final result
        return {
            "status": "success",
            "total_detected": len(detected_ingredients),
            # This array will go to the DB for recipe search
            "ingredients": detected_ingredients,
            # Frontend will display this to the user
            "image_base64": img_base64,
        }

    except Exception as e:
        print(f"[ERROR] Exception during prediction: {str(e)}")
        return JSONResponse(status_code=500, content={"error": str(e)})
