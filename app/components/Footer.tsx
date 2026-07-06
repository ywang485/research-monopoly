export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="game-footer">
      <p>&copy; {currentYear} Scientific Research is Gambling with Your Life. Created by <a href="https://ywang485.github.io">Yi</a>.</p>
    </footer>
  )
}
