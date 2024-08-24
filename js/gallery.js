const images = [
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820__480.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820_1280.jpg',
    description: 'Hokkaido Flower',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
    description: 'Container Haulage Freight',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
    description: 'Aerial Beach View',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
    description: 'Flower Blooms',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
    description: 'Alpine Mountains',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
    description: 'Mountain Lake Sailing',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
    description: 'Alpine Spring Meadows',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
    description: 'Nature Landscape',
  },
  {
    preview:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
    original:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
    description: 'Lighthouse Coast Sea',
  },
];

const gallery = document.querySelector('.gallery');
const fragment = document.createDocumentFragment();
let currentImgIndex;

images.forEach((image, index) => {
  const li = document.createElement('li');
  li.classList.add('gallery-item');
  const a = document.createElement('a');
  a.classList.add('gallery-link');
  a.href = image.original;

  const img = document.createElement('img');
  img.classList.add('gallery-image');
  img.src = image.preview;
  img.dataset.source = image.original;
  img.dataset.index = index;
  img.alt = image.description;
  a.append(img);
  li.append(a);
  fragment.append(li);
});

gallery.append(fragment);
gallery.addEventListener('click', selectImage);

function selectImage(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  const image = event.target;
  const instance = basicLightbox.create('', {
    className: 'lightbox',
    onShow: instance => {
      const elem = instance.element();
      setTimeout(() => elem.classList.add('show'), 10);
    },
    onClose: instance => {
      const elem = instance.element();
      elem.classList.remove('show');
    },
  });

  makeLightbox(
    instance,
    image.dataset.source,
    image.alt,
    Number(image.dataset.index)
  );
}

function makeLightbox(instance, url, caption, index) {
  const elem = instance.element();
  elem.innerHTML = '';
  elem.appendChild(lightboxHtml(url, caption, index));
  instance.show();
  addCloseEventListener(instance);
  currentImgIndex = index;
  addArrowEventListener(instance);
}

function addCloseEventListener(instance) {
  const elem = instance.element();
  const closeButton = elem.querySelector('.lightbox-close');
  closeButton.addEventListener('click', () => {
    instance.close();
  });
}

function addArrowEventListener(instance) {
  const elem = instance.element();
  const prevButton = elem.querySelector('.gallery-arrow-prev');
  const nextButton = elem.querySelector('.gallery-arrow-next');

  prevButton.addEventListener('click', () =>
    handleArrowClick(instance, currentImgIndex, -1)
  );

  nextButton.addEventListener('click', () =>
    handleArrowClick(instance, currentImgIndex, 1)
  );
}

function handleArrowClick(instance, currentIndex, direction) {
  let newIndex = (currentIndex + direction + images.length) % images.length;
  const newImage = images[newIndex];

  updateLightbox(
    instance,
    newImage.original,
    newImage.description,
    newIndex,
    direction
  );

  const elem = instance.element();
  elem.classList.remove('show');
  if (!elem.classList.contains('show')) {
    setTimeout(() => elem.classList.add('show'), 10);
  }
}

function updateLightbox(instance, url, caption, index, directionIndex) {
  const elem = instance.element();
  const img = elem.querySelector('.lightbox-img');

  const direction = directionIndex === 1 ? 'right' : 'left';

  img.classList.add(`fade-out-${direction}`);
  img.addEventListener(
    'animationend',
    () => {
      img.src = url;

      img.classList.remove(`fade-out-${direction}`);
      img.classList.add(`fade-in-${direction}`);

      setTimeout(() => img.classList.remove(`fade-in-${direction}`), 600);

      elem.querySelector('.lightbox-caption').textContent = caption;
      elem.querySelector('.lightbox-counter').textContent = `${index + 1} / ${
        images.length
      }`;
    },
    { once: true }
  );
  currentImgIndex = index;
}

function lightboxHtml(imgUrl, imgcaption, index) {
  let nextIndex = (index + 1) % images.length;
  let prevIndex = (index - 1 + images.length) % images.length;

  const lightboxContainer = document.createElement('div');

  const closeButton = document.createElement('button');
  closeButton.classList.add('lightbox-close');
  const closeSvg = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  );
  closeSvg.classList.add('icon', 'icon-close');
  const closeUse = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'use'
  );
  closeUse.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'href',
    './images/icons.svg#icon-close'
  );
  closeSvg.appendChild(closeUse);
  closeButton.appendChild(closeSvg);
  lightboxContainer.appendChild(closeButton);

  const prevButton = document.createElement('button');
  prevButton.classList.add('gallery-arrow', 'gallery-arrow-prev');
  prevButton.setAttribute('data-next', prevIndex);
  const prevSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  prevSvg.classList.add('icon', 'icon-arrow');
  const prevUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  prevUse.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'href',
    './images/icons.svg#icon-arrow-left'
  );
  prevSvg.appendChild(prevUse);
  prevButton.appendChild(prevSvg);
  lightboxContainer.appendChild(prevButton);

  const figure = document.createElement('figure');
  figure.classList.add('lightbox-figure');
  const img = document.createElement('img');
  img.classList.add('lightbox-img');
  img.src = imgUrl;
  const figcaption = document.createElement('figcaption');
  figcaption.classList.add('lightbox-caption');
  figcaption.textContent = imgcaption;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  lightboxContainer.appendChild(figure);

  const nextButton = document.createElement('button');
  nextButton.classList.add('gallery-arrow', 'gallery-arrow-next');
  nextButton.setAttribute('data-next', nextIndex);
  const nextSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  nextSvg.classList.add('icon', 'icon-arrow');
  const nextUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  nextUse.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'href',
    './images/icons.svg#icon-arrow-right'
  );
  nextSvg.appendChild(nextUse);
  nextButton.appendChild(nextSvg);
  lightboxContainer.appendChild(nextButton);

  const counterDiv = document.createElement('div');
  counterDiv.classList.add('lightbox-counter');
  counterDiv.textContent = `${index + 1}/${images.length}`;
  lightboxContainer.appendChild(counterDiv);

  return lightboxContainer;
}
