/**
 * @file public/js/joueurs/ResponsiveLogo.js
 * @author Nathan EPRON
 */

const logo = document.querySelector('.Img-Logo-Quizbox');
const logoWidth = 600;
const logoHeight = 150;
const minWidth = 360;
const minHeight = 90;

function resizeLogo() {
  const logoParent = document.querySelector('.Logo-Quizbox');
  const parentWidth = logoParent.getBoundingClientRect().width;
  const parentHeight = logoParent.getBoundingClientRect().height;

  if (parentHeight < logoHeight || parentWidth < logoWidth || window.innerWidth < minWidth) {
    const heightFactor = parentHeight / logoHeight;
    const widthFactor = parentWidth / logoWidth;
    const factor = Math.min(heightFactor, widthFactor);
    const newHeight = logoHeight * factor;
    const newWidth = logoWidth * factor;
    if (newHeight >= minHeight && newWidth >= minWidth) {
      logo.style.width = newWidth + 'px';
      logo.style.height = newHeight + 'px';
    } else {
      logo.style.width = minWidth + 'px';
      logo.style.height = minHeight + 'px';
    }
  } else {
    logo.style.width = '';
    logo.style.height = '';
  }
}

resizeLogo();

window.addEventListener('resize', function () {
  resizeLogo();
});