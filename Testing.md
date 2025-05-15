
# SwiftHive | Testing

Return to [README](README.md)

---

Comprehensive testing has been performed to ensure the website's seamless and optimal functionality.

## Table of Contents
### [Responsiveness Testing](#responsiveness-testing)
### [Browser Compatibility Testing](#browser-compatibility-testing)
### [Device Testing](#device-testing)
### [Code Validation](#code-validation)
* [HTML Validation](#html-validation)
* [CSS Validation](#css-validation)
* [JavaScript Validation](#javascript-validation)
* [Python](#python)
### [Bugs](#bugs)
* [Resolved Bugs](#resolved-bugs)
* [Unresolved Bugs](#unresolved-bugs)
### [Automated Testing](#automated-testing)
### [Features Testing](#features-testing)
---

## Responsiveness Testing

The SwiftHive website was tested on a variety of devices and screen sizes using browser developer tools and real devices. The layout, content, and functionality adapt well to different screen sizes thanks to the use of Bootstrap grid systems and responsive design techniques.

## Browser Compatibility Testing

The website was tested on the following browsers:
- Chrome
- Firefox
- Microsoft Edge
- Safari (MacOS)
- Samsung Internet (Mobile)

All major features work consistently across these browsers.

## Device Testing

Real device testing was performed on the following devices:
- Windows Desktop
- MacBook (13”)
- Samsung Galaxy S21
- iPhone XR
- iPad

Each view was validated to ensure elements render correctly and all buttons and links function as expected.

## Code Validation

### HTML Validation

Validated using W3C Markup Validation Service. No major errors were found.

### CSS Validation

Custom CSS was validated using W3C CSS Validator. Minor warnings related to Bootstrap overrides were noted but did not affect performance.


### Python

Python code was validated using flake8. Minor line-length warnings were handled by refactoring where necessary, or justified where clarity was improved.

## Bugs

### Resolved Bugs

- **Double Form Submission**
  - **Bug**: Submitting forms multiple times created duplicates.
  - **Solution**: Added JavaScript to disable submit button on click and server-side checks to prevent duplicates.

- **Broken Media Uploads in Production**
  - **Bug**: File/image uploads (profile pictures, CVs) were not showing.
  - **Solution**: Integrated Cloudinary for consistent media handling in production.

- **Admin and User View Conflicts**
  - **Bug**: Admin panel did not distinguish clearly between freelance and employer accounts.
  - **Solution**: Added custom admin filters and grouped permissions.

- **Email Field Duplication During Signup**
  - **Bug**: Email field allowed duplicates due to a faulty unique check.
  - **Solution**: Enforced unique email field in custom user model and added backend validation.

- **Heroku Environment Variable Errors**
  - **Bug**: Secret key and Cloudinary URL not picked up correctly.
  - **Solution**: Added proper environment variable management and fallbacks in `settings.py`.

### Unresolved Bugs

None known at this time.

## Features Testing

| Page            | Action                                   | Expected Result                                          | Status |
|-----------------|------------------------------------------|----------------------------------------------------------|--------|
| Home Page       | Click "Find Freelancers"                 | Redirects to search page with freelancer cards           | PASS   |
|                 | Click "Hire Now" CTA                     | Redirects to login/signup if not logged in               | PASS   |
| Sign Up         | Submit invalid email                     | Shows form error                                         | PASS   |
|                 | Mismatched passwords                     | Shows "Passwords must match"                            | PASS   |
| Login           | Valid credentials                        | Redirect to dashboard                                    | PASS   |
|                 | Invalid credentials                      | Show error: "Invalid email or password"                  | PASS   |
| Freelancer Dashboard | Edit profile                       | Form saves changes and updates live profile              | PASS   |
| Employer Dashboard | Post Job                              | Job post saved and listed on job board                   | PASS   |
| Contact         | Submit empty form                        | Shows error "Please fill out all fields"                 | PASS   |
| Contact         | Valid message                            | Confirmation message shown                               | PASS   |
| Profile Pages   | Visit public freelancer profile          | Profile visible with contact/hire button                 | PASS   |

---

All functionality tested and verified as of last deployment.
