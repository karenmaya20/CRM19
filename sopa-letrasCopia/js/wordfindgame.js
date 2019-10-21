/**
* Wordfind.js 0.0.1
* (c) 2012 Bill, BunKat LLC.
* Wordfind is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/wordfind

	-LPFR Agosto 27, 2019 se agrego pintado de palabras, al encontrarlas
	-LPFR Agosto 27, 2019 se agrego estructura nueva de lista de reactivas
   -LPFR Agosto 27, 2019 se agrego visibildiad de palabras encontradas en respuestas.
*/
var idObjetivo=0;
var aciertos=0;
var inc=0;
var camino;
var bodyOriginal;

function creaColores(cuantos){
  var arreglo = [];
  for (var i = 0; i < cuantos; i++){
    var comp1 = Math.floor(Math.random() * 255);
    var comp2 = Math.floor(Math.random() * 255);
    var comp3 = Math.floor(Math.random() * 255);
    arreglo.push('rgb(' + comp1 + ',' + comp2 + ',' + comp3 + ')')
  }
  return (arreglo)
};

var patrono = creaColores(50);

(function (document, $, wordfind) {



  'use strict';

  /**
  * An example game using the puzzles created from wordfind.js. Click and drag
  * to highlight words.
  *
  * WordFindGame requires wordfind.js and jQuery.
  */

  /**
  * Initializes the WordFindGame object.
  *
  * @api private
  */
  var WordFindGame = function() {

    




    // List of words for this game
    var wordList=[];
    var parrlist=[];

    /**
    * Draws the puzzle by inserting rows of buttons into el.
    *
    * @param {String} el: The jQuery element to write the puzzle to
    * @param {[[String]]} puzzle: The puzzle to draw
    */
    var drawPuzzle = function (el, puzzle) {
      
      var output = '';
      // for each row in the puzzle
      for (var i = 0, height = puzzle.length; i < height; i++) {
        // append a div to represent a row in the puzzle
        var row = puzzle[i];
        output += '<div>';
        // for each element in that row
        for (var j = 0, width = row.length; j < width; j++) {
            // append our button with the appropriate class
            // if (i == 0) {
            //   if (j == 0) {
            //     output += '<button style="border-style:solid; border-left-width:2px; border-top-width:2px" class="puzzleSquare" x="' + j + '" y="' + i + '">';
            //   }
            //   else {
            //     if (j == row.length-1) {
            //       output += '<button style="border-style:solid; border-right-width:2px; border-top-width:2px" class="puzzleSquare" x="' + j + '" y="' + i + '">';
            //     }
            //     else {
            //       output += '<button style="border-style:solid; border-top-width:2px" class="puzzleSquare" x="' + j + '" y="' + i + '">';
            //     }
            //   }
            // }
            // else {
            //   if (i == puzzle.length-1) {
            //     if (j == 0) {
            //       output += '<button style="border-style:solid; border-left-width:2px; border-bottom-width:2px" class="puzzleSquare" x="' + j + '" y="' + i + '">';
            //     }
            //     else {
            //       if (j == row.length-1) {
            //         output += '<button style="border-style:solid; border-right-width:2px; border-bottom-width:2px" class="puzzleSquare" x="' + j + '" y="' + i + '">';
            //       }
            //       else {
            //         output += '<button style="border-style:solid; border-bottom-width:2px;" class="puzzleSquare" x="' + j + '" y="' + i + '">';
            //       }
            //     }
            //   }
            //   else {
            //     if (j == 0) {
            //       output += '<button style="border-style:solid; border-left-width:2px;" class="puzzleSquare" x="' + j + '" y="' + i + '">';
            //     }
            //     else {
            //       if (j == row.length-1) {
            //         output += '<button style="border-style:solid; border-right-width:2px;" class="puzzleSquare" x="' + j + '" y="' + i + '">';
            //       }
            //       else {
            //         output += '<button class="puzzleSquare" x="' + j + '" y="' + i + '">';
            //       }
            //     }
            //   }
            // }
            output += '<button class="puzzleSquare" x="' + j + '" y="' + i + '">';
            output += row[j] || '&nbsp;';
            output += '</button>';
        }
        // close our div that represents a row
        output += '</div>';
      }

      $(el).html(output);
    };

    /**
    * Draws the words by inserting an unordered list into el.
    *
    * @param {String} el: The jQuery element to write the words to
    * @param {[String]} words: The words to draw
    */
    var drawWords = function (el, words) {
      // patrono = patrono.sort(function() {return Math.random() - 0.5});
      var output = '<ul>';
      for (var i = 0, len = words.length; i < len; i++) {
        var word = words[i];
        console.log(words);
        var oracion= parrlist[i];
        var contenido="";
        for(var m=0; m<oracion.length;m++){
          if(m==0){ 
            contenido+=""+(i+1)+".- ";
              }
   
    if(oracion.charAt(m)=="@") { 
      contenido+='<span data-resp="'+word+'" class="word ' + word +' ocultar normal">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
     }
    else{ contenido+=oracion.charAt(m); }

          
        }

        output += '<li>'+contenido;
    
      }
      output += '</ul>';

      $(el).html(output);
      bodyOriginal = document.body.innerHTML;

    };


    /**
    * Game play events.
    *
    * The following events handle the turns, word selection, word finding, and
    * game end.
    *
    */

    // Game state
    var startSquare, selectedSquares = [], curOrientation, curWord = '';

    /**
    * Event that handles mouse down on a new square. Initializes the game state
    * to the letter that was selected.
    *
    */
    var startTurn = function () {
      $(this).addClass('selected');
      startSquare = this;
      selectedSquares.push(this);
      curWord = $(this).text();
    };



    /**
    * Event that handles mouse over on a new square. Ensures that the new square
    * is adjacent to the previous square and the new square is along the path
    * of an actual word.
    *
    */
    var select = function (target) {
      // if the user hasn't started a word yet, just return
      if (!startSquare) {
        return;
      }

      // if the new square is actually the previous square, just return
      var lastSquare = selectedSquares[selectedSquares.length-1];
      if (lastSquare == target) {
        return;
      }

      // see if the user backed up and correct the selectedSquares state if
      // they did
      var backTo;
      for (var i = 0, len = selectedSquares.length; i < len; i++) {
        if (selectedSquares[i] == target) {
          backTo = i+1;
          break;
        }
      }

      while (backTo < selectedSquares.length) {
        $(selectedSquares[selectedSquares.length-1]).removeClass('selected');
        selectedSquares.splice(backTo,1);
        curWord = curWord.substr(0, curWord.length-1);
      }


      // see if this is just a new orientation from the first square
      // this is needed to make selecting diagonal words easier
      var newOrientation = calcOrientation(
          $(startSquare).attr('x')-0,
          $(startSquare).attr('y')-0,
          $(target).attr('x')-0,
          $(target).attr('y')-0
          );

      if (newOrientation) {
        selectedSquares = [startSquare];
        curWord = $(startSquare).text();
        if (lastSquare !== startSquare) {
          $(lastSquare).removeClass('selected');
          lastSquare = startSquare;
        }
        curOrientation = newOrientation;
      }

      // see if the move is along the same orientation as the last move
      var orientation = calcOrientation(
          $(lastSquare).attr('x')-0,
          $(lastSquare).attr('y')-0,
          $(target).attr('x')-0,
          $(target).attr('y')-0
          );

      // if the new square isn't along a valid orientation, just ignore it.
      // this makes selecting diagonal words less frustrating
      if (!orientation) {
        return;
      }

      // finally, if there was no previous orientation or this move is along
      // the same orientation as the last move then play the move
      if (!curOrientation || curOrientation === orientation) {
        curOrientation = orientation;
        playTurn(target);
      }

    };
    
    var touchMove = function(e) {
      var xPos = e.originalEvent.touches[0].pageX;
      var yPos = e.originalEvent.touches[0].pageY;
      var targetElement = document.elementFromPoint(xPos, yPos);
      select(targetElement)
    };
    
    var mouseMove = function() { 
      select(this);
    };

    /**
    * Updates the game state when the previous selection was valid.
    *
    * @param {el} square: The jQuery element that was played
    */
    var playTurn = function (square) {

      // make sure we are still forming a valid word
      for (var i = 0, len = wordList.length; i < len; i++) {
        if (wordList[i].indexOf(curWord + $(square).text()) === 0) {
          $(square).addClass('selected');
          selectedSquares.push(square);
          curWord += $(square).text();
          break;
        }
      }
    };

    /**
    * Event that handles mouse up on a square. Checks to see if a valid word
    * was created and updates the class of the letters and word if it was. Then
    * resets the game state to start a new word.
    *
    */
    var endTurn = function () {

      // see if we formed a valid word
      for (var i = 0, len = wordList.length; i < len; i++) {
        
        if (wordList[i] === curWord) {
          aciertos++;
          $('.selected').addClass('found');
        
          //colores aleatorios que se le agregan a las palabras
        $('.selected').css("background-color", patrono[inc] )
        console.log(wordList.length);
        console.log("hola");
      
        
          wordList.splice(i,1);
          console.log(curWord);
          var noValido = /\s/;

//se agregan las clases para mostrar la palabra
          $('.' + curWord).addClass('wordFound');
         var dato= $('.' + curWord).attr("data-resp");
          $('.' + curWord).html(dato);
          $('.' + curWord).css("color", patrono[inc])
          $('.' + curWord).removeClass("normal");
          inc++;
        }
//se revisa si estan todas encontradas
        if (wordList.length === 0) {
        var final=words.length;
          $('.puzzleSquare').addClass('complete');
          swal({
            title: "Resultado",
            text: "Buen trabajo,has encontrado "+ aciertos + " de "+ final,
            confirmButtonText: "Aceptar",
            type: "info",
            button: "Aceptar",
          }); 
          
          // location.reload();

          if (ambSCORM) {
            //califica SCORM
            if (parent.conectividadSCORM === undefined) {
              console.log("Actividad en documento, es con try");
              try {
                conectividadSCORM.calificarObjetivo(idObjetivo, aciertos, final, 0);   // envia los datos a la base de datos
                conectividadSCORM.finalizarObjetivo(idObjetivo);	                             // finaliza la actividad en estatus passed
                conectividadSCORM.salvar();                                                      // confirma que lo anteriormente realizado es válido
                if (barraSCORM) {conectividadSCORM.actualizarBarra()}	                         // actualiza al nuevo estatus la barra de avance
                conectividadSCORM.verificarEstado();                                             // coloca status de la leccion en completed si cumple los requisitos}
              } catch(e){
              console.warn("Error al calificar en conectividadSCORM");
              }
            }
            else {
              console.log("Actividad en frame, es con parent");
              parent.conectividadSCORM.calificarObjetivo(idObjetivo, aciertos, final, 0); // envia los datos a la base de datos
              parent.conectividadSCORM.finalizarObjetivo(idObjetivo);	                              // finaliza la actividad en estatus passed
              parent.conectividadSCORM.salvar();                                                    // confirma que lo anteriormente realizado es válido
              if (barraSCORM) {parent.conectividadSCORM.actualizarBarra()}	                      // actualiza al nuevo estatus la barra de avance
              parent.conectividadSCORM.verificarEstado();                                           // coloca status de la leccion en completed si cumple los requisitos
            }
            //fin califica SCORM
          }

    
        }
      }

      // reset the turn
      $('.selected').removeClass('selected');
      startSquare = null;
      selectedSquares = [];
      curWord = '';
      curOrientation = null;
    };

    /**
    * Given two points, ensure that they are adjacent and determine what
    * orientation the second point is relative to the first
    *
    * @param {int} x1: The x coordinate of the first point
    * @param {int} y1: The y coordinate of the first point
    * @param {int} x2: The x coordinate of the second point
    * @param {int} y2: The y coordinate of the second point
    */
    var calcOrientation = function (x1, y1, x2, y2) {

      for (var orientation in wordfind.orientations) {
        var nextFn = wordfind.orientations[orientation];
        var nextPos = nextFn(x1, y1, 1);

        if (nextPos.x === x2 && nextPos.y === y2) {
          return orientation;
        }
      }

      return null;
    };

    return {

      /**
      * Creates a new word find game and draws the board and words.
      *
      * Returns the puzzle that was created.
      *
      * @param {[String]} words: The words to add to the puzzle
      * @param {String} puzzleEl: Selector to use when inserting the puzzle
      * @param {String} wordsEl: Selector to use when inserting the word list
      * @param {Options} options: WordFind options to use when creating the puzzle
      */
      create: function(words, puzzleEl, wordsEl, options) {

        if (ambSCORM) {
          //Inicio carga SCORM
          if (parent.conectividadSCORM === undefined) {
            console.log("Actividad en documento, es con try");
            try {
              var conexion = conectividadSCORM.conectarYComenzar();
              console.log("actividad:: -> ", conexion);
              conectividadSCORM.iniciarObjetivo(idObjetivo);           // inicializa la actividad
              if (barraSCORM) {conectividadSCORM.actualizarBarra()}    // actualiza la barra de avance
              conectividadSCORM.salvar();                              // guarda el status
            } catch(e){
            console.warn("Error con conectividad SCORM");
            }
          }
          else {
            console.log("Actividad en frame, es con parent");
            if (parent.document.readyState === "complete"){
              iniciarSCORM();
              console.log("ya había cargado");
            }
            else {
              console.log("agregó listener");
              parent.addEventListener("load", function(){
                iniciarSCORM();
              });
            }
            function iniciarSCORM(){
              var conexion = parent.conectividadSCORM.conectarYComenzar();
              console.log("actividad:: -> ", conexion);
              parent.conectividadSCORM.iniciarObjetivo(idObjetivo);          // inicializa la actividad
              if (barraSCORM) {parent.conectividadSCORM.actualizarBarra()}   // actualiza la barra de avance
              parent.conectividadSCORM.salvar();                             // guarda el status
            }
          }
          //Fin carga SCORM
        }

        if (words.length >= 41){
          words.splice(40,1);
          }
        
        for(var p=0;p<words.length;p++){

          if(words[p][1].length>18){  
          words[p][1]= words[p][1].substring(0,18);
          }
          // se chequea el regex de que el string no tenga espacio
            words[p][1]=words[p][1].replace(" ","\u00a0");
            
          
        }

          for(var i=0; i<words.length;i++){

           wordList.push(words[i][1]); 
    
            }

            for(var j=0; j<words.length;j++){

              parrlist.push(words[j][0]); 


               }

      
console.log(wordList);
        var puzzle = wordfind.newPuzzle(words, options);

        // draw out all of the words
        drawPuzzle(puzzleEl, puzzle);
        drawWords(wordsEl, wordList);

        // attach events to the buttons
        // optimistically add events for windows 8 touch
        if (window.navigator.msPointerEnabled) {
          $('.puzzleSquare').on('MSPointerDown', startTurn);
          $('.puzzleSquare').on('MSPointerOver', select);
          $('.puzzleSquare').on('MSPointerUp', endTurn);
        }
        else {
          $('.puzzleSquare').mousedown(startTurn);
          $('.puzzleSquare').mouseenter(mouseMove);
          $('.puzzleSquare').mouseup(endTurn);
          $('.puzzleSquare').on("touchstart", startTurn);
          $('.puzzleSquare').on("touchmove", touchMove);
          $('.puzzleSquare').on("touchend", endTurn);
        }

        return puzzle;
      },

      /**
      * Solves an existing puzzle.
      *
      * @param {[[String]]} puzzle: The puzzle to solve
      * @param {[String]} words: The words to solve for
      */
      solve: function(puzzle, words) {

        var solution = wordfind.solve(puzzle, words).found;

        for( var i = 0, len = solution.length; i < len; i++) {
          var word = solution[i].word,
              orientation = solution[i].orientation,
              x = solution[i].x,
              y = solution[i].y,
              next = wordfind.orientations[orientation];

          if (!$('.' + word).hasClass('wordFound')) {
            for (var j = 0, size = word.length; j < size; j++) {
              var nextPos = next(x, y, j);
              $('[x="' + nextPos.x + '"][y="' + nextPos.y + '"]').addClass('solved');
            }

            $('.' + word).addClass('wordFound');
          }  
        }

var subraya=document.getElementsByClassName("normal");

for(var m=0; m<subraya.length;m++){
$(subraya[m]).addClass("subraya");
var contenidopalabra=$(subraya[m]).attr("data-resp");
$(subraya[m]).html(contenidopalabra);
}




var final=words.length;
        if (ambSCORM) {
          //califica SCORM
          if (parent.conectividadSCORM === undefined) {
            console.log("Actividad en documento, es con try");
            try {
              conectividadSCORM.calificarObjetivo(idObjetivo, aciertos, final, 0);   // envia los datos a la base de datos
              conectividadSCORM.finalizarObjetivo(idObjetivo);	                             // finaliza la actividad en estatus passed
              conectividadSCORM.salvar();                                                      // confirma que lo anteriormente realizado es válido
              if (barraSCORM) {conectividadSCORM.actualizarBarra()}	                         // actualiza al nuevo estatus la barra de avance
              conectividadSCORM.verificarEstado();                                             // coloca status de la leccion en completed si cumple los requisitos}
            } catch(e){
            console.warn("Error al calificar en conectividadSCORM");
            }
          }
          else {
            console.log("Actividad en frame, es con parent");
            parent.conectividadSCORM.calificarObjetivo(idObjetivo, aciertos, final, 0); // envia los datos a la base de datos
            parent.conectividadSCORM.finalizarObjetivo(idObjetivo);	                              // finaliza la actividad en estatus passed
            parent.conectividadSCORM.salvar();                                                    // confirma que lo anteriormente realizado es válido
            if (barraSCORM) {parent.conectividadSCORM.actualizarBarra()}	                      // actualiza al nuevo estatus la barra de avance
            parent.conectividadSCORM.verificarEstado();                                           // coloca status de la leccion en completed si cumple los requisitos
          }
          //fin califica SCORM
        }
var mensaje="";
        for(var j=0;j<retroCal1.length;j++){
          console.log(aciertos);
      
          if(aciertos >= retroCal1[j].LimInf && aciertos <= retroCal1[j].LimSup){
          mensaje=retroCal1[j].Mensaje;
          }}

   swal({
             title: "Resultado",
             text: mensaje +" has encontrado "+ aciertos + " de "+ final,
             confirmButtonText: "Aceptar",
             type: "info",
             button: "Aceptar",
           }); 

      }
    };
  };


  /**
  * Allow game to be used within the browser
  */
  window.wordfindgame = WordFindGame();

}(document, jQuery, wordfind));
