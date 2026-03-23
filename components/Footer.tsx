import ThemeToggle from '@/ui/ThemeToggle';

export default function Footer() {
  return (
    <footer className="bg-body text-typography">
      <div className="mx-auto flex h-full items-center justify-between">
        <p>Footer</p>
        <ThemeToggle />
      </div>
    </footer>
  );
}