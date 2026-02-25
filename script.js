document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("hero-canvas");
    const ctx = canvas.getContext("2d");
    const navbar = document.getElementById("navbar");

    // Setup canvas resolution to avoid blur
    function resizeCanvas() {
        // High DPI displays
        const scale = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * scale;
        canvas.height = window.innerHeight * scale;
        ctx.scale(scale, scale);

        // Fix CSS dimensions
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        if (images.length > 0 && images[0].complete) {
            renderFrame(currentFrameIndex);
        }
    }

    window.addEventListener("resize", resizeCanvas);

    const frameCount = 147;
    const images = [];
    let imagesLoaded = 0;
    let currentFrameIndex = 0;

    // Zero-padding helper for file names like ezgif-frame-001.jpg. 
    // Uses relative path 'nike2/' to ensure it works on GitHub Pages when the repo is the root
    const currentFrame = index => `nike2/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

    // Preload all 240 images
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === 1 || i === currentFrameIndex) {
                // Render first downloaded frame immediately
                renderFrame(currentFrameIndex);
            }
        };
        images.push(img);
    }

    function renderFrame(index) {
        if (!images[index] || !images[index].complete) return;
        const img = images[index];

        // Physical dimensions due to pixel ratio scaling
        const w = window.innerWidth;
        const h = window.innerHeight;

        // contain logic
        const imgRatio = img.width / img.height;
        const canvasRatio = w / h;

        let drawWidth, drawHeight;

        if (canvasRatio > imgRatio) {
            drawHeight = h;
            drawWidth = img.width * (h / img.height);
        } else {
            drawWidth = w;
            drawHeight = img.height * (w / img.width);
        }

        ctx.clearRect(0, 0, w, h);

        // High quality interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw centered
        ctx.drawImage(img, (w - drawWidth) / 2, (h - drawHeight) / 2, drawWidth, drawHeight);
    }

    // Scroll Logic
    const html = document.documentElement;
    const scrollyWrapper = document.getElementById("scrolly-wrapper");

    window.addEventListener("scroll", () => {
        const scrollTop = html.scrollTop;
        // Fix the scroll boundary to the scrolly section so it stops animating when scrolling past it
        const maxScrollTop = scrollyWrapper.scrollHeight - window.innerHeight;
        const scrollFraction = Math.min(Math.max(scrollTop / maxScrollTop, 0), 1);

        // Update Canvas Frame
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );

        if (frameIndex !== currentFrameIndex) {
            currentFrameIndex = frameIndex;
            requestAnimationFrame(() => renderFrame(frameIndex));
        }

        // Update Navbar Visibility
        if (scrollTop > 50) {
            navbar.classList.add("visible");
            if (scrollTop > 100) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        } else {
            navbar.classList.remove("visible", "scrolled");
        }

        // Handle Text Sections
        updateTextSections(scrollFraction);
    });

    // Check visibility slightly after load for navbar
    setTimeout(() => {
        if (html.scrollTop <= 50) {
            navbar.classList.add("visible");
        }
    }, 500);

    const sections = Array.from(document.querySelectorAll(".text-section"));

    function updateTextSections(fraction) {
        // Define exact boundaries aligned with requirements
        // 0-15%: Assembled pose
        // 15-40%: Components soft explosion
        // 40-65%: Traction and propulsion emphasized
        // 65-85%: Touch and comfort
        // 85-100%: Reassemble

        const ranges = [
            [0.0, 0.15],
            [0.15, 0.40],
            [0.40, 0.65],
            [0.65, 0.85],
            [0.85, 1.01] // upper bound slight overflow to catch 1.0 reliably
        ];

        sections.forEach((section, index) => {
            const [start, end] = ranges[index];

            if (fraction >= start && fraction < end) {
                section.classList.add("active");
                section.classList.remove("fade-up");
            } else if (fraction >= end) {
                section.classList.remove("active");
                section.classList.add("fade-up");
            } else {
                section.classList.remove("active");
                section.classList.remove("fade-up");
            }
        });
    }

    // Initialize state
    resizeCanvas();
    updateTextSections(0);
});
