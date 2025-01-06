document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('overlay');
    const navbar = document.querySelector('.header');
    const modal = document.getElementById('loginModal');

    // Toggle mobile menu and overlay
    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click from bubbling up to the document
        menu.classList.toggle('show');
        overlay.classList.toggle('show');
    });

    // Close menu and overlay when clicking outside
    document.addEventListener('click', (event) => {
        if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
            menu.classList.remove('show');
            overlay.classList.remove('show');
        }
    });

    // Close menu when overlay is clicked
    overlay.addEventListener('click', () => {
        menu.classList.remove('show');
        overlay.classList.remove('show');
    });

    // Hide navbar when modal opens
    modal.addEventListener('shown.bs.modal', () => {
        navbar.classList.add('hidden');
    });

    // Show navbar when modal closes
    modal.addEventListener('hidden.bs.modal', () => {
        navbar.classList.remove('hidden');
    });
});



$(document).ready(function () {
    const courses = [
        { name: 'Course 1', image: '/assets/images/app-development.jpg', link: '/student/apply-course/App Development', title: 'app-development' },
        { name: 'Course 2', image: '/assets/images/full-stack-developer.jpg', link: '/student/apply-course/Full Stack Developer', title: 'full-stack-developer' },
        { name: 'Course 3', image: '/assets/images/python.jpg', link: '/student/apply-course/Python Programming', title: 'python-programming' },
        { name: 'Course 4', image: '/assets/images/wev-development.jpg', link: '/student/apply-course/Web Development', title: 'web-development' },
        { name: 'Course 5', image: '/assets/images/c-plus.jpg', link: '/student/apply-course/C-C++', title: 'c-c-plus' },
        { name: 'Course 6', image: '/assets/images/JAVA.jpg', link: '/student/apply-course/Java Programming', title: 'java-programming' }
    ];
    
    const internships = [
        { name: 'Internship 1', image: '/assets/images/app-development-internship.jpg', link: '/student/apply-internship/App Development', title: 'app-development' },
        { name: 'Internship 2', image: '/assets/images/java-programming-internship.jpg', link: '/student/apply-internship/Java Programming', title: 'java-programming' },
        { name: 'Internship 3', image: '/assets/images/ui-ux-internship.jpg', link: '/student/apply-internship/UI-UX', title: 'U-UX' },
        { name: 'Internship 4', image: '/assets/images/web-developer-internship.jpg', link: '/student/apply-internship/Web Development', title: 'Web Development' },
        { name: 'Internship 5', image: '/assets/images/digital-marketing-internship.jpg', link: '/student/apply-internship/Digital Marketing', title: 'Digital Marketing' }
    ];

    function renderCourses() {
        let coursesHtml = '';
        courses.forEach(course => {
            coursesHtml += `
        <div class="card-grid">
            <div class="card">
                <img src="${course.image}" alt="${course.name}" class="img-fluid">
                <div class="text-left py-4">
                    <a class="btn-default color-blacked" href="${course.link}" title="${course.title}">
                        Apply Now
                        <i class="fa-sharp fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
        `;
        });
        $('#courses-slider').html(coursesHtml);
    }

    function renderInternships() {
        let internshipsHtml = '';
        internships.forEach(internship => {
            internshipsHtml += `
        <div class="card-grid">
            <div class="card">
                <img src="${internship.image}" alt="${internship.name}" class="img-fluid">
                <div class="text-left py-4">
                    <a class="btn-default color-blacked" href="${internship.link}" title="${internship.title}">
                        Apply Now
                        <i class="fa-sharp fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
        `;
        });
        $('#internships-slider').html(internshipsHtml);
    }

    renderCourses();
    renderInternships();

    $('.slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
});

let lastScrollPosition = 0; // Store the last scroll position
const navbar = document.getElementById("header");

window.addEventListener("scroll", () => {
    const currentScrollPosition = window.pageYOffset;

    if (currentScrollPosition > lastScrollPosition) {
        // User is scrolling down, hide the navbar
        navbar.classList.add("hidden");
    } else {
        // User is scrolling up, show the navbar
        navbar.classList.remove("hidden");
    }

    // Update last scroll position
    lastScrollPosition = currentScrollPosition;
});
