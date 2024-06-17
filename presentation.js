/* --------------- hover images section ---------------------- */

var images_section = document.querySelectorAll('.img_section img');
console.log(images_section);
images_section.forEach(image => {
    image.addEventListener("mouseover", function () {
        image.style.transform = "scale(1.02)";
    })
    image.addEventListener("mouseout", function () {
        image.style.transform = "scale(1)";
    })
})