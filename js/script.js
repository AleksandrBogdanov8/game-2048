var sizes = document.querySelector('.sizes');
var game = document.querySelector('.game');
var playsize = document.querySelectorAll('.size');
var size = 5;
var itemgames = [];
var position;
var newPosition;
var score = document.querySelector('.score');
var records = document.querySelector('.records');
var localName = 'RECORD';
var statusgame;
var backbutton = document.querySelector('.backbutton');
var startagain = document.querySelector('.startagain');
var recordval;


// проверяем есть ли у нас локалсторадже, если нет, создаем его. 
if (!localStorage.getItem(localName)) {
    localStorage.setItem(localName, score.textContent);
}

recordval = +localStorage.getItem(localName);
records.innerText = recordval;


// выбираем размер игрового поля и запускаем игру
sizes.addEventListener('click', function(event) {
    // Выбираем размер игового поля
    if (event.target.classList.contains('size')) {
        size = +(event.target.getAttribute('data-size'));
    }
    //делаем выбранный размер активным
    playsize.forEach(function(item) {
        if (item.getAttribute('data-size') == size) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // При нажатии кнопки "START" скрываем поле с размером и показываем игровое поле с заданой размерностью
    if (event.target.classList.contains('startgame')) {
        sizes.classList.add('hidden');
        game.classList.remove('hidden');
        startgame();
    }
});

// создаем игровое поле указанным размером
function startgame() {
    var itemsize = 100 / size;
    var count = 1;
    statusgame = createHTMLelem('div', ['statusgame', 'hidden']);

    for (var j = 0; j < size; j++) {
        for (var i = 0; i < size; i++) {
            var itemgame = createHTMLelem('div', ['itemgame'], count++);


            itemgame.style.width = itemsize + '%';
            itemgame.style.height = itemsize + '%';
            itemgame.style.paddingTop = itemsize / 2.5 + '%';


            game.appendChild(itemgame);
            itemgames.push(itemgame);

        }
    }
    game.appendChild(statusgame);

    cellselection(2);
    coloritem();

}

// функция для создания HTML элементов
function createHTMLelem(tag, classes, data) {
    var elem = document.createElement(tag);
    for (var i = 0; i < classes.length; i++) {
        elem.classList.add(classes[i]);
    }

    if (data) {
        elem.setAttribute('data-num', data - 1);
    }

    return elem;
}

// случайный выбор ячейки для задания значания "2"
function cellselection(amount) {
    var count = 0;
    var num;

    while (count < amount) {
        num = Math.floor(Math.random() * (size * size));
        if (!itemgames[num].textContent) {
            itemgames[num].innerText = 2;
            count++;
        }
    }
    coloritem();
}

// Определяем цвет кадой ячейки со значением, в зависимости от значения
function coloritem() {
    var colors = ['#fffbc9', '#c4c3b9', '#e69b45', '#d94c00', '#ff645e', '#d60000', '#d1d11d', '#606060'];

    itemgames.forEach(function(item) {
        switch (item.textContent) {
            case '2':
                item.style.background = colors[0];
                break;
            case '4':
                item.style.background = colors[1];
                break;
            case '8':
                item.style.background = colors[2];
                break;
            case '16':
                item.style.background = colors[3];
                break;
            case '32':
                item.style.background = colors[4];
                break;
            case '64':
                item.style.background = colors[5];
                break;
            default:
                item.style.background = colors[7]
        }

        if (item.textContent >= 128) {
            item.style.background = colors[6];
        }
    });
}


//Определяем направление смещения
game.onmousedown = function() {
    position = +event.target.getAttribute('data-num');
}

game.onmouseup = function() {
    if (event.which == 1) {
        newPosition = +event.target.getAttribute('data-num');
        var result = position - newPosition;

        if (result >= 1 && result < size) {
            moveitem(1);
        } else if (result <= -1 && result > -size) {
            moveitem(-1);
        } else if (result >= size) {
            moveitem(size);
        } else if (result <= -size) {
            moveitem(-size);
        }
    }
}


// Смещаем все ячейки со значением в заданом направлении и добавляем одно новое в произвольном месте
function moveitem(direction) {
    // смещение на лево
    if (direction == 1) {
        for (var iter1 = 0; iter1 < size - 1; iter1++) {
            for (var j = 0; j < itemgames.length; j++) {
                if ((j % size) != 0) {
                    if (!itemgames[j - 1].textContent) {
                        itemgames[j - 1].innerText = itemgames[j].textContent;
                        itemgames[j].innerText = '';
                    } else if (itemgames[j - 1].textContent == itemgames[j].textContent) {
                        itemgames[j - 1].innerText = itemgames[j].textContent * 2;
                        sumscore(itemgames[j].textContent * 2);
                        itemgames[j].innerText = '';


                    }

                }

            }
        }
        // смещение на право
    } else if (direction == -1) {
        for (var iter2 = 0; iter2 < size - 1; iter2++) {
            for (var j2 = itemgames.length - 1; j2 >= 0; j2--) {
                if ((j2 % size) != size - 1) {
                    if (!itemgames[j2 + 1].textContent) {
                        itemgames[j2 + 1].innerText = itemgames[j2].textContent;
                        itemgames[j2].innerText = '';
                    } else if (itemgames[j2 + 1].textContent == itemgames[j2].textContent) {
                        itemgames[j2 + 1].innerText = itemgames[j2].textContent * 2;
                        sumscore(itemgames[j2].textContent * 2);
                        itemgames[j2].innerText = '';
                    }
                }
            }

        }
        // смещение вверх
    } else if (direction == size) {
        for (var iter3 = 0; iter3 < size - 1; iter3++) {
            for (var j3 = size; j3 < itemgames.length; j3++) {
                if (!itemgames[j3 - size].textContent) {
                    itemgames[j3 - size].innerText = itemgames[j3].textContent;
                    itemgames[j3].innerText = '';
                } else if (itemgames[j3 - size].textContent == itemgames[j3].textContent) {
                    itemgames[j3 - size].innerText = itemgames[j3].textContent * 2;
                    sumscore(itemgames[j3].textContent * 2);
                    itemgames[j3].innerText = '';
                }

            }
        }
        // смещение вниз
    } else if (direction == -size) {
        for (var iter4 = 0; iter4 < size - 1; iter4++) {
            for (var j4 = itemgames.length - size - 1; j4 >= 0; j4--) {
                if (!itemgames[j4 + size].textContent) {
                    itemgames[j4 + size].innerText = itemgames[j4].textContent;
                    itemgames[j4].innerText = '';
                } else if (itemgames[j4 + size].textContent == itemgames[j4].textContent) {
                    itemgames[j4 + size].innerText = itemgames[j4].textContent * 2;
                    sumscore(itemgames[j4].textContent * 2);
                    itemgames[j4].innerText = '';
                }
            }
        }

    }

    coloritem();
    //на каждом изменении проверяем, не достигли ли мы окончания игры
    var testgame = finishgame();

    if (!testgame) {
        cellselection(1);
    } else if (testgame == 1) {
        statusgame.innerText = 'you win!!!!';
        statusgame.classList.remove('hidden');
    } else if (testgame == 2) {
        statusgame.innerText = 'game over!';
        statusgame.classList.remove('hidden');
    }

}

// считаем очки, а также проверяем рекорд
function sumscore(sum) {
    var scoreval = +score.textContent;


    scoreval += sum;

    score.innerText = scoreval;

    if (recordval < scoreval) {

        localStorage.setItem(localName, scoreval);
        records.innerText = scoreval;
    }
}

//проверяем достигли мы окончания игры или нет
function finishgame() {

    var test = false;
    var testwin = false;

    itemgames.forEach(function(item) {
        if (item.textContent >= 2048) {
            testwin = true;
        } else if (item.textContent == '') {
            test = true;
        }
    });

    if (test && !testwin) {
        return 0;
    } else if (testwin) {
        return 1;
    } else {
        return 2;
    }
}

// обрабатываем click на кнопке startagain
startagain.onclick = function() {
    if (!statusgame.classList.contains('hidden')) {
        statusgame.classList.add('hidden');
    }

    itemgames.forEach(function(item) {
        item.innerText = '';
    })
    score.innerText = 0;
    cellselection(2);
}

// обрабатываем ckicl на кнопке backbutton
backbutton.onclick = function() {
    if (!statusgame.classList.contains('hidden') || !game.classList.contains('hidden')) {
        //     statusgame.classList.add('hidden');
        itemgames.forEach(function(item) {
            game.removeChild(item);
        })
        itemgames.splice(0, size * size);
        score.innerText = 0;
        statusgame.remove();
    }
    game.classList.add('hidden');
    sizes.classList.remove('hidden');
}