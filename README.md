# 🌟 Sayedun Muntaka's Portfolio 🌟

Welcome to the repository for my portfolio website. This site showcases my skills, projects, and professional background.



## 🌐 Website Overview

This portfolio website includes the following sections:
- **Home**: A brief introduction about myself.
- **About**: Detailed information about my background, skills, and interests.
- **Photos**: A gallery of my photography work.
- **Contact**: Ways to get in touch with me.



## ✨ Features

- **Smooth Scrolling**: Navigate through the sections with smooth scrolling.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Visitor Logging**: Logs visitor information and sends it to Telegram for tracking.
- **Back to Top Button**: Easily scroll back to the top of the page.



## 🛠️ Technologies Used

- **HTML5**: For structuring the content.
- **CSS3**: For styling the website.
- **JavaScript**: For interactivity and visitor logging.
- **Cloudflare Workers**: For serverless functions and visitor logging.
- **Telegram API**: For sending visitor logs to Telegram.
- **W3.CSS**: For responsive design and layout.



## 🚀 How to Run

1. Clone the repository:
    ```sh
    git clone https://github.com/SayedunMuntaka/sayedunmuntaka.github.io.git
    ```
2. Navigate to the project directory:
    ```sh
    cd sayedunmuntaka.github.io
    ```
3. Open `index.html` in your web browser to view the website.



## 📊 Visitor Logging

The website includes a visitor logging feature that captures the following information:
- Screen resolution
- Battery status
- Geolocation (if permitted)
- Device memory
- Network information
- Platform and user agent details
This information is sent to a Cloudflare Worker, which logs the data and sends it to a Telegram chat for counting visitors.



## 🛠️ How to Modify and Make Your Own

To customize this portfolio for your own use, follow these steps:

1. **Update Personal Information**:
    - Open `index.html` and replace the personal details, such as name, bio, and contact information, with your own.
    - Update the image sources to point to your own images.

2. **Customize Styles**:
    - Modify `styles.css` to change the look and feel of the website. You can adjust colors, fonts, and layout as needed.

3. **Visitor Logging**:
    - If you want to use the visitor logging feature, set up your own Cloudflare Worker and update the URLs in `index.html` and `viewerlogger.js` to point to your own endpoints.
    - Update the environment variables in `fullmonthlogger.js` and `viewerlogger.js` with your own Telegram bot token and chat ID.

4. **Deploy**:
    - Once you have made your changes, you can deploy the website to a hosting service of your choice, such as GitHub Pages, Netlify, or Vercel.



## 📞 Contact

For contact information, click the logo below. 

[![Contact Logo](https://via.placeholder.com/150)](https://sayedunmuntaka.github.io/#contact)

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for visiting my portfolio website repository. I hope you find it informative and engaging!
