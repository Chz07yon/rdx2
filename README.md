# RED Studio (RDX2)

A premium platform for RED Studio, a high-end photography, videography, and digital media agency. The platform allows clients to explore portfolios, understand signature services, meet the team, and request bookings for video edits, shoots, web development, and digital art.

## Architecture

This project is built with a focus on high-performance, vanilla web technologies to ensure a cinematic and immersive user experience.

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with a bespoke design system featuring glassmorphism, cinematic red accents, and smooth scroll reveals.
- **Icons:** FontAwesome (v6.4.0)

## Signature Services

RED Studio is divided into three primary divisions:
- **Code RED:** A high-end web development wing focused on specialized solutions tailored to client needs.
- **Shape RED:** The creative digital wing forging impactful digital media including posters, title cards, and logos.
- **RDX RED:** The premium photography and videography wing of the RED Studio.

## Project Structure

- `index.html` - The landing page featuring a cinematic hero, featured work strip, and trust marquee.
- `portfolio.html` - A masonry gallery showcasing past projects.
- `services.html` - Detailed breakdown of the three signature services.
- `team.html` - Roster of the creative visionaries behind RED Studio.
- `about.html` - Studio history and philosophy.
- `contact.html` - Booking and inquiry forms.
- `assets/` - Images, videos, fonts, and the primary `style.css` stylesheet.
- `js/` - Logic for IntersectionObservers, mobile navigation, and interactive elements.

## Recent Updates & Enhancements

- **Navigation Restructure:** Reorganized site architecture to group services under a unified mega-menu dropdown for cleaner UX.
- **Cinematic Hero:** Implemented a bespoke CSS animation cycle that alternates the primary Wattermark and Secondary logos every 10 seconds.
- **Performance:** Optimized scroll-reveals (`.fade-in`, `.fade-up-heavy`) using JavaScript `IntersectionObserver` to reduce rendering overhead.
- **Team Roster:** Added support for classified/upcoming team members to build hype for new hires.

## Getting Started

To view the project locally, simply clone the repository and open `index.html` in your browser. For the best experience, host the files using a local development server (e.g., Live Server extension in VS Code) to ensure all assets and local paths resolve correctly.
