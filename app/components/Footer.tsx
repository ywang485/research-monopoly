export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="game-footer">
      <p>&copy; {currentYear} Theoropoly created by <a href="https://ywang485.github.io">Yi</a>.</p>
    </footer>
  )
}
