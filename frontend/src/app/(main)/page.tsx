import { Landing } from '../components/Landing/Landing';
import { AuthRedirect } from '../components/AuthRedirect/AuthRedirect';

export default function Home() {
  return (
    <>
      <AuthRedirect />
      <Landing />
    </>
  );
}
