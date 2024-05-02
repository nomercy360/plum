import Icons from './Icons';
import Link from './Link';
import { useRouter } from 'next/router';

export default function NavbarCart(props: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <nav className="flex h-14 w-full flex-row items-center justify-between bg-transparent p-5 sm:p-6">
      <Link href="/">
        <Icons.logo className="h-6 w-32" />
      </Link>
      {props.children}
    </nav>
  );
}
