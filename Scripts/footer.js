

function createFooter() {
    // Define the footer HTML content
    const root = "/Commercial-Grade-Website"; // folder name

    const footerHTML = `
        <footer class="footer">
        <div class="footer-logo">
            <img src="${root}/Images/125Logo.png" alt="AC Milan Logo">
        </div>
        <div class="footer-content">
            <div class="footer-links">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="${root}/index.html">Home</a></li>
                    <li><a href="${root}/Memories/memories.html">Memories</a></li>
                    <li><a href="${root}/DataViz/index.html">Data Visualizations</a></li>
                    <li><a href="${root}/Theory/index.html">Theory</a></li>
                    <li><a href="${root}/Design/index.html">Design</a></li>
                    <li><a href="${root}/form.html">Sign Up!</a></li>
                </ul>
            </div>
            <div class="footer-socials">
                <h4>Follow Us</h4>
                <ul>
                    <li><a href="https://www.facebook.com/ACMilan" target="_blank">Facebook</a></li>
                    <li><a href="https://www.twitter.com/ACMilan" target="_blank">Twitter</a></li>
                    <li><a href="https://www.instagram.com/acmilan" target="_blank">Instagram</a></li>
                    <li><a href="https://www.youtube.com/acmilan" target="_blank">YouTube</a></li>
                </ul>
            </div>
            <div class="footer-contact">
                <h4>Contact Us</h4>
                <p>Email: info@acmilan.com</p>
                <p>Phone: +xxx xxx xxxx</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Cameron Morgan | AC Milan Website</p>
        </div>
    </footer>
    `;

    // Insert the footer HTML into the DOM
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

createFooter();