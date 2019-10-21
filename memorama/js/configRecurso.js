//bandera necesaria si se utilziaran videos
var vidmaster=false;

//boton rendirse revela las cartas faltantes
var rendirse=true;
//contiene la ruta de la cubierta de las cartas
var imagentapa="./imagenes/bocina.png";

//ancho y alto de la carta del memorama
var anchocarta=105;
var altocarta=105;

//opcion para separar las cartas o tenerlas en un solo contenedor
var separador=true;
//idioma ya sea español= ESP ò bien inglès=ENG
var idioma="ENG";


var ambSCORM = false;
var barraSCORM = false;
  //para retros en español
var retroCal1 = [
	{LimInf: 0, LimSup: 3, Mensaje: "No fue suficiente"},	
	{LimInf: 4, LimSup: 6, Mensaje: "Esfuérzate más"},	
	{LimInf: 7, LimSup: 9, Mensaje: "Suficiente"},	
	{LimInf: 10, LimSup: 10, Mensaje: "Excelente"},	
    ];
    //para retros en inglès
    var retroCal2 = [
        {LimInf: 0, LimSup: 3, Mensaje: "It was not enough"},	
        {LimInf: 4, LimSup: 6, Mensaje: "Work harder"},	
        {LimInf: 7, LimSup: 9, Mensaje: "Enough"},	
        {LimInf: 10, LimSup: 10, Mensaje: "Excelent"},	
        ];