// Управление попапом
var ESC_KEYCODE = 27;

var body = document.querySelector('body');
var popupOpen = document.querySelector('.main-nav__order-button');
var popup = document.querySelector('.popup');
var popupClose = document.querySelector('.popup__close');
var overlay = document.querySelector('.overlay');
var nameField = document.querySelector('#name-popup');

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) closePopup();
};

var openPopup = function () {
  popup.classList.add('popup-show');
  body.classList.add('hidden-scroll');
  nameField.focus();
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function () {
  popup.classList.remove('popup-show');
  body.classList.remove('hidden-scroll');
  document.removeEventListener('keydown', onPopupEscPress);
};

popupOpen.addEventListener('click', function () {
  openPopup();
});

popupClose.addEventListener('click', function () {
  closePopup();
});

overlay.addEventListener('click', function () {
  closePopup();
});

// Валидация поля ввода телефона

var telInputs = document.querySelectorAll('input[type=tel]');

var onTelInputValidate = function (evt) {
  this.setCustomValidity('');
  if (this.validity.patternMismatch) {
    this.setCustomValidity('Введите телефон в формате: +7 (XXX) XXX XXXX');
  };
};

var setCursorPosition = function (pos, elem) {
  elem.focus();
  if (elem.setSelectionRange) {
    elem.setSelectionRange(pos, pos);
  } else if (elem.createTextRange) {
    var range = elem.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select()
  }
};

var onTelInputMask = function (evt) {
  var matrix = '+7 (___) ___ ____';
  var i = 0;
  var def = matrix.replace(/\D/g, '');
  var val = this.value.replace(/\D/g, '');

  if (def.length >= val.length) {
    val = def;
  }

  this.value = matrix.replace(/./g, function(a) {
    if (/[_\d]/.test(a) && i < val.length) {
      return val.charAt(i++);
    } else if (i >= val.length) {
      return '';
    } else {
      return a;
    }
  });

  if (evt.type == 'blur') {
    if (this.value.length == 2) {
      this.value = '';
    }
  } else {
    setCursorPosition(this.value.length, this);
  }
};

for (var i = 0; i < telInputs.length; i++) {
  telInputs[i].addEventListener('input', onTelInputValidate);
  telInputs[i].addEventListener('input', onTelInputMask);
  telInputs[i].addEventListener('focus', onTelInputMask);
  telInputs[i].addEventListener('blur', onTelInputMask);
};

// Аккордеон в подвале
var TABLET_WIDTH = 767;
var mapButton = document.querySelector('.footer__map h2');
var mapList = document.querySelector('.footer__map-list');
var contactsButton = document.querySelector('.footer__contacts h2');
var contactsList = document.querySelector('.footer__contacts p');

var onMapButtonPress = function (evt) {
  if (mapButton.classList.contains('closed__info') && !contactsButton.classList.contains('closed__info')) {
    contactsButton.classList.toggle('closed__info');
    contactsList.classList.toggle('hidden');
  }
  mapButton.classList.toggle('closed__info');
  mapList.classList.toggle('hidden');
};

var onContactsButtonPress = function (evt) {
  if (contactsButton.classList.contains('closed__info') && !mapButton.classList.contains('closed__info')) {
    mapButton.classList.toggle('closed__info');
    mapList.classList.toggle('hidden');
  }
  contactsButton.classList.toggle('closed__info');
  contactsList.classList.toggle('hidden');
};

var hideInfo = function () {
  mapButton.classList.add('closed__info');
  mapList.classList.add('hidden');
  contactsButton.classList.add('closed__info');
  contactsList.classList.add('hidden');
  mapButton.addEventListener('click', onMapButtonPress);
  contactsButton.addEventListener('click', onContactsButtonPress);
}

if (window.innerWidth < TABLET_WIDTH) {
  hideInfo();
}

window.addEventListener('resize', function() {
  if (window.innerWidth < TABLET_WIDTH) {
    hideInfo();
  } else {
    mapButton.removeEventListener('click', onMapButtonPress);
    contactsButton.removeEventListener('click', onContactsButtonPress);
  }
})
