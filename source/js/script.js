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
var contactsButton = document.querySelector('.footer__contacts h2');

var onAccordionButtonPress = function (evt) {
  var content = this.nextElementSibling;
  this.classList.toggle('closed__info');
  content.classList.toggle('hidden');
};

if (window.innerWidth < TABLET_WIDTH) {
  mapButton.addEventListener('click', onAccordionButtonPress);
  contactsButton.addEventListener('click', onAccordionButtonPress);
}

window.addEventListener('resize', function() {
  if (window.innerWidth < TABLET_WIDTH) {
    mapButton.addEventListener('click', onAccordionButtonPress);
    contactsButton.addEventListener('click', onAccordionButtonPress);
  } else {
    mapButton.removeEventListener('click', onAccordionButtonPress);
    contactsButton.removeEventListener('click', onAccordionButtonPress);
  }
})
