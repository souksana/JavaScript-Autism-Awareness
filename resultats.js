// ▶▶▶▶▶ DECLARATIONS DE VARIABLES
// gen 
var inputFile = document.getElementById("xls");
var reader;
var workbook;
var wsnames;
var first_ws;
var result;

// tab gen
var tabTSA, tabDT, tabAge;
var tabAgeMIN, tabAgeMAX;

// tab age 
var tabAgeMaxDT, tabAgeMinDT
var tabAgeMaxTSA, tabAgeMinTSA;

// stats 
var myBoxplot, myChartDT, myChartTSA, listVariables;

// gen 
var indiceAge;
var minAge, maxAge;
var output = document.getElementById('result');

// select 
var divVisageSelect = document.getElementById('visageSelect');
var divAgeSelect = document.getElementById('ageSelect');
var divZoneSelect = document.getElementById('zoneSelect');
var divVariableSelect = document.getElementById('variableSelect');



// ▶▶▶▶▶ FONCTIONS
function reconstruireVariable() {
    var retour = divVariableSelect.value + '_';
    if (divVariableSelect.value != "TTT") {
        retour += divZoneSelect.value + '_';
    }
    retour += divVisageSelect.value;
    return retour;
}


function previewXLSFile(e) {
    var file = e.target.files[0];
    console.log(inputFile.value)
    reader = new FileReader();
    reader.onload = function (e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: 'array' });
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // header: 1 instructs xlsx to create an 'array of arrays'
        result = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        var nomFichier = document.querySelector(".nomFichier")
        nomFichier.innerHTML = "Visages_Data_Traite_SAE303.xlsx"






        //Traitement du fichier


        tabTSA = result.filter(function (f) { return f[result[1].indexOf("Case")] == 'TSA' });
        tabDT = result.filter(function (f) { return f[result[1].indexOf("Case")] == 'DT' });

        indiceAge = result[1].indexOf('Age (ans)');
        console.log(indiceAge);

        //////////////////////////////////////////////////// TEST POUR AGE 

        tabAge = recuperationValeursVariable(result, 1)
        tabAge.shift()

        maxAge = Math.trunc(Math.max(...tabAge))
        minAge = Math.trunc(Math.min(...tabAge))
        console.log(maxAge)
        console.log(minAge)

        /////////////////////////////////////////////////// FIN TEST AGE 

        listVariables = result[1].filter((f) => { return f != "" });
        var listeParametre = [];
        var listeVisage = [];
        var listeZone = [];
        var listeAge = [];
        for (var i = 4; i < listVariables.length; i++) {
            var listeTermVariable = listVariables[i].split('_')
            if (listeParametre.indexOf(listeTermVariable[0]) == -1) {
                listeParametre.push(listeTermVariable[0]);
            }
            if (listeVisage.indexOf(listeTermVariable[listeTermVariable.length - 1]) == -1) {
                listeVisage.push(listeTermVariable[listeTermVariable.length - 1]);
            }
            if (listeTermVariable.length == 3) {
                if (listeZone.indexOf(listeTermVariable[1]) == -1) {
                    listeZone.push(listeTermVariable[1]);
                }
            }
        }

        for (let i = (minAge + 1); i < maxAge; i++) {
            listeAge.push(i)
        }

        remplirSelect("variableSelect", listeParametre);
        remplirSelect("zoneSelect", listeZone);
        remplirSelect("visageSelect", listeVisage);
        remplirSelect("ageSelect", listeAge);

        var choixVisage = document.querySelector('.choix_visage');
        var choixAge = document.querySelector('.choix_age');
        var accordion = document.querySelector('.accordionS')
        if (result && result.length > 0) {
            choixVisage.classList.remove('d-none'); // Afficher le select visage
            choixAge.classList.remove('d-none'); // Afficher le select age
            accordion.classList.remove('d-none'); // Afficher les résultats

        } else {
            choixVisage.classList.add('d-none'); // Cacher le select visage
            choixAge.classList.add('d-none'); // Cacher le select age
            accordion.classList.add('d-none'); // Cacher les résultats
        }

        afficheGraphe();
        divVariableSelect.onchange = afficheGraphe;
        divVisageSelect.onchange = afficheGraphe;
        divZoneSelect.onchange = afficheGraphe;
        divAgeSelect.onchange = afficheGraphe;



    }
    reader.readAsArrayBuffer(file); //console.log(ss.min(tabTestIndiceTSA));
};

function afficheGraphe() {
    var variableTest = reconstruireVariable();
    var indiceVariableTest = result[1].indexOf(variableTest);

    console.log(indiceVariableTest)

    ////////////////////////////////////////////// age boxplot

    var ageOPSlct = parseInt(divAgeSelect.value);
    tabAgeMIN = result.filter(function (f) { return f[result[1].indexOf("Age (ans)")] < (ageOPSlct + 1) });
    tabAgeMAX = result.filter(function (f) { return f[result[1].indexOf("Age (ans)")] >= (ageOPSlct + 1) });
    tabAgeMIN.unshift(result[1])
    tabAgeMAX.unshift(result[1])

    // console.log(tabAgeMAX)
    // console.log(tabAgeMIN)

    //////// DT 
    tabAgeMinDT = tabAgeMIN.filter(function (f) { return f[tabAgeMIN[0].indexOf("Case")] == 'DT' });
    tabAgeMaxDT = tabAgeMAX.filter(function (f) { return f[tabAgeMAX[0].indexOf("Case")] == 'DT' });

    // console.log(tabAgeMinDT)
    // console.log(tabAgeMaxDT)

    /////// TSA
    tabAgeMinTSA = tabAgeMIN.filter(function (f) { return f[tabAgeMIN[0].indexOf("Case")] == 'TSA' });
    tabAgeMaxTSA = tabAgeMAX.filter(function (f) { return f[tabAgeMAX[0].indexOf("Case")] == 'TSA' });

    // console.log(tabAgeMinTSA)
    // console.log(tabAgeMaxTSA)


    ////////////////////////////////////////////// fin age boxplot  

    // exemple pour des boxplots
    var tabTestIndiceDT = recuperationValeursVariable(tabDT, indiceVariableTest)
    var tabTestIndiceDTMin = recuperationValeursVariable(tabAgeMinDT, indiceVariableTest)
    var tabTestIndiceDTMax = recuperationValeursVariable(tabAgeMaxDT, indiceVariableTest)


    var tabTestIndiceTSA = recuperationValeursVariable(tabTSA, indiceVariableTest)
    var tabTestIndiceTSAMin = recuperationValeursVariable(tabAgeMinTSA, indiceVariableTest)
    var tabTestIndiceTSAMax = recuperationValeursVariable(tabAgeMaxTSA, indiceVariableTest)

    // construction du jeu à afficher 
    var boxplotTestData = {
        labels: ["2-13 ans", "2-" + ageOPSlct + " ans", (ageOPSlct + 1) + "-13 ans"],
        datasets: [
            {
                label: 'DT',
                backgroundColor: 'rgba(251,133,0,0.5)',
                borderColor: 'red',
                borderWidth: 1,
                outlierColor: '#999999',
                padding: 10,
                itemRadius: 0,
                data: [
                    tabTestIndiceDT, tabTestIndiceDTMin, tabTestIndiceDTMax,
                ]
            },
            {
                label: 'TSA',
                backgroundColor: 'rgba(33,158,188,0.5)',
                borderColor: 'blue',
                borderWidth: 1,
                outlierColor: '#999999',
                padding: 10,
                itemRadius: 0,
                data: [
                    tabTestIndiceTSA, tabTestIndiceTSAMin, tabTestIndiceTSAMax
                ]
            }
        ]
    }

    const ctx = document.getElementById("canvas").getContext("2d");
    if (myBoxplot != null) {
        myBoxplot.destroy();
    }
    myBoxplot = new Chart(ctx, {
        type: 'boxplot',
        data: boxplotTestData,
        options: {
            responsive: true,
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Boxplot de ' + result[1][indiceVariableTest] + ' par cat age'
            }
        }
    });


    // exemple de graph ligne
    deuxVarTab = recuperationValeursDeuxVariables(tabDT, indiceAge, indiceVariableTest)
    var tabDTTestIndiceAge = deuxVarTab[0];
    var tabDTTestIndiceValues = deuxVarTab[1];

    const ctx2 = document.getElementById("canvasDT").getContext("2d");
    if (myChartDT != null) {
        myChartDT.destroy();
    }
    myChartDT = new Chart(ctx2, {
        type: "line",
        data: {
            labels: tabDTTestIndiceAge,
            datasets: [{
                label: "DT",
                backgroundColor: "rgba(251,133,0,0.5)",
                borderColor: "rgba(255,0,0,0.1)",
                data: tabDTTestIndiceValues
            }]
        },
    });

    deuxVarTabTSA = recuperationValeursDeuxVariables(tabTSA, indiceAge, indiceVariableTest)
    var tabTSATestIndiceAge = deuxVarTabTSA[0];
    var tabTSATestIndiceValues = deuxVarTabTSA[1];

    const ctx3 = document.getElementById("canvasTSA").getContext("2d");
    if (myChartTSA != null) {
        myChartTSA.destroy();
    }
    myChartTSA = new Chart(ctx3, {
        type: "line",
        data: {
            labels: tabTSATestIndiceAge,
            datasets: [{
                label: "TSA",
                backgroundColor: "rgba(33,158,188,0.5)",
                borderColor: "rgba(255,0,0,0.1)",
                data: tabTSATestIndiceValues
            }]
        },
    });

    /////// DETAILS
    //////////visage
    var tabVisages = [
        ["images/visages/visage1.jpg", "visage1"],
        ["images/visages/visage2.jpg", "visage2"],
        ["images/visages/visage3.jpg", "visage3"],
        ["images/visages/visage4.jpg", "visage4"],
    ]
    var imgVisage = document.querySelector(".imgVisage img")
    var visages = divVisageSelect.value

    if (visages == "Visage1") {
        imgVisage.src = tabVisages[0][0];
        imgVisage.alt = tabVisages[0][1];
    } else if (visages == "Visage2") {
        imgVisage.src = tabVisages[1][0];
        imgVisage.alt = tabVisages[1][1];
    } else if (visages == "Visage3") {
        imgVisage.src = tabVisages[2][0];
        imgVisage.alt = tabVisages[2][1];
    } else if (visages == "Visage4") {
        imgVisage.src = tabVisages[3][0];
        imgVisage.alt = tabVisages[3][1];
    }

    //////////pictos
    var tabPictos = [
        ["images/pictos/LatBouche.svg", "Latence Bouche"], //0
        ["images/pictos/LatTete.svg", "Latence Tête"],
        ["images/pictos/LatYeux.svg", "Latence Yeux"], //2

        ["images/pictos/NBFBouche.svg", "Nombre de fixations Bouche"],
        ["images/pictos/NBFEcran.svg", "Nombre de fixations Ecran"],
        ["images/pictos/NBFTete.svg", "Nombre de fixations Tête"],
        ["images/pictos/NBFYeux.svg", "Nombre de fixations Yeux"], //6

        ["images/pictos/TFBouche.svg", "Temps Fixations Bouche"],
        ["images/pictos/TFEcran.svg", "Temps Fixations Ecran"],
        ["images/pictos/TFTete.svg", "Temps Fixations Tete"],
        ["images/pictos/TFYeux.svg", "Temps Fixations Yeux"], //10

        ["images/pictos/TPBouche.svg", "Temps Passé Bouche"],
        ["images/pictos/TPEcran.svg", "Temps Passé Ecran"],
        ["images/pictos/TPTete.svg", "Temps Passé Tete"],
        ["images/pictos/TPYeux.svg", "Temps Passé Yeux"], //14

        ["images/pictos/TTT.svg", "Temps Total Tracké"], //15
    ]

    var imgPictos = document.querySelector(".imgPictos img")
    var pictos = divVariableSelect.value
    var zones = divZoneSelect.value
    var rowVar = document.querySelector(".rowVar")
    var rowErreur = document.querySelector(".rowErreur")

    if ((pictos == "Lat") && (zones == "Bouche")) { // BOUCLE LAT
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[0][0]
        imgPictos.alt = tabPictos[0][1]
    } else if ((pictos == "Lat") && (zones == "Tete")) {
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[1][0]
        imgPictos.alt = tabPictos[1][1]
    } else if ((pictos == "Lat") && (zones == "Yeux")) {
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[2][0]
        imgPictos.alt = tabPictos[2][1]
    }

    if ((pictos == "NBF") && (zones == "Bouche")) { // BOUCLE NBF
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[3][0]
        imgPictos.alt = tabPictos[3][1]
    } else if ((pictos == "NBF") && (zones == "Tete")) {
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[4][0]
        imgPictos.alt = tabPictos[4][1]
    } else if ((pictos == "NBF") && (zones == "Yeux")) {
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[5][0]
        imgPictos.alt = tabPictos[5][1]
    } else if ((pictos == "NBF") && (zones == "Ecran")) {
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[6][0]
        imgPictos.alt = tabPictos[6][1]
    }

    if ((pictos == "TF") && (zones == "Bouche")) { // BOUCLE TF
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[7][0]
        imgPictos.alt = tabPictos[7][1]
    } else if ((pictos == "TF") && (zones == "Tete")) {
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[8][0]
        imgPictos.alt = tabPictos[8][1]
    } else if ((pictos == "TF") && (zones == "Yeux")) {
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[9][0]
        imgPictos.alt = tabPictos[9][1]
    } else if ((pictos == "TF") && (zones == "Ecran")) {
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[10][0]
        imgPictos.alt = tabPictos[10][1]
    }

    if ((pictos == "TP") && (zones == "Bouche")) { // BOUCLE TP
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[11][0]
        imgPictos.alt = tabPictos[11][1]
    } else if ((pictos == "TP") && (zones == "Tete")) {
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[12][0]
        imgPictos.alt = tabPictos[12][1]
    } else if ((pictos == "TP") && (zones == "Yeux")) {
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[13][0]
        imgPictos.alt = tabPictos[13][1]
    } else if ((pictos == "TP") && (zones == "Ecran")) {
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[14][0]
        imgPictos.alt = tabPictos[14][1]
    }

    if (pictos == "TTT") { // BOUCLE TTT
        rowVar.classList.remove("d-none")
        rowErreur.classList.add("d-none")
        imgPictos.src = tabPictos[15][0]
        imgPictos.alt = tabPictos[15][1]
    }

    if ((pictos == "Lat") && (zones == "Ecran")) { // BOUCLE ERREURS
        rowVar.classList.add("d-none")
        rowErreur.classList.remove("d-none")
    } else if ((pictos == "NBEZ") && (zones == "Ecran")) {
        rowVar.classList.add("d-none")
        rowErreur.classList.remove("d-none")
    }

    ////////////////////////////////////////////////////////////////// GENERAL 

    var divTabRecap = document.querySelector(".divTabRecap")
    var tabRecap = [
        ["Variable", "Moyenne DT", "Moyenne TSA", "Ecart", "pvalue"]
    ]
    console.log(recuperationValeursVariable(tabDT, indiceVariableTest))
    // divTabRecap.appendChild(creationTableauHTML2D(variableTest))
}




// fonction qui renvoie les valeurs d'une colonne donnée d'indice (indice) dans un tableau 2D (tab) avec élimination des valeurs vides
function recuperationValeursVariable(tab, indice) {
    var tabResult = [];
    tab.forEach(ligne => {
        if (ligne[indice] != null && ligne[indice] != 1000 && ligne[indice] != "" && ligne[indice] != 0 && ligne[indice] != undefined) {
            tabResult.push(ligne[indice]);
        }
    });
    return tabResult;
}

// fonction qui renvoie un tableau de deux colonnes contenant les valeurs de deux colonnes données d'indices (indice1, indice2) dans un tableau 2D (tab)
function recuperationValeursDeuxVariables(tab, indice1, indice2) {
    var tabResult1 = [];
    var tabResult2 = [];
    tab.forEach(ligne => {
        var condIndice1 = ligne[indice1] != null && ligne[indice1] != 1000 && ligne[indice1] != "" && ligne[indice1] != 0 && ligne[indice1] != undefined;
        var condIndice2 = ligne[indice2] != null && ligne[indice2] != 1000 && ligne[indice2] != "" && ligne[indice2] != 0 && ligne[indice2] != undefined;
        if (condIndice1 && condIndice2) {
            tabResult1.push(ligne[indice1]);
            tabResult2.push(ligne[indice2]);
        }
    });
    return [tabResult1, tabResult2];
}

// fonction qui retourne la valeur d'un nombre x avec une précision de 6
function precise(x) {
    return x.toPrecision(6);
}

// fonction qui retourne vrai si la valeur de la ligne à l'indice (indiceAge) est comprise entre minAge et maxAge
function testCatAge(ligne, indiceAge, minAge, maxAge) {
    return (Math.floor(ligne[indiceAge]) >= minAge && Math.floor(ligne[indiceAge]) <= maxAge);
}

// fonction qui renvoie un élement HTML correspondant à un tableau 2D avec entête	
function creationTableauHTML2D(tab) {
    var retour = document.createElement("table");
    for (var i in tab) {
        var tr = document.createElement("tr");
        for (var j of tab[i]) {
            var td = (i == 0) ? document.createElement("th") : document.createElement("td");
            td.textContent = j;
            tr.appendChild(td);
        }
        retour.appendChild(tr);
    }
    return retour;
}


//fonction qui renvoie la valeur de la p-value d'un t-test pour deux tableaux 1D en entrée
function ttestpvalue(array1, array2) {
    var mean1 = ss.mean(array1);
    var mean2 = ss.mean(array2);
    var tTest2 = Math.abs(
        (mean1 - mean2) /
        Math.sqrt((ss.variance(array1) / array1.length) +
            (ss.variance(array2) / array2.length))
    );
    var degFre = Math.pow(ss.variance(array1) / array1.length +
        ss.variance(array2) / array2.length, 2) /
        (
            (Math.pow(ss.variance(array1) / array1.length, 2) / (array1.length - 1))
            + (Math.pow(ss.variance(array2) / array2.length, 2) / (array2.length - 1))
        );
    var p_value = 1 - jStat.studentt.cdf(tTest2, Math.abs(degFre));
    return p_value;
}

function remplirSelect(idSelect, listeOption) {
    var divSelect = document.querySelector("#" + idSelect);

    listeOption.forEach(option => {
        var optionHTML = document.createElement("option");
        optionHTML.value = option;
        optionHTML.innerHTML = option;
        divSelect.appendChild(optionHTML);
    }
    );
}

inputFile.addEventListener("change", previewXLSFile, false);

/////////////////////////////////////////// VS CHARTS
const dn1 = document.getElementById('dn1');
const dn2 = document.getElementById('dn2');
const dn3 = document.getElementById('dn3');

new Chart(dn1, {
    type: 'bar',
    data: {
        labels: ["1 | Fixation de l'écran"],
        datasets: [
            {
                label: 'DT',
                data: [71, 2, 3],
                backgroundColor: "rgba(251,133,0,0.5)",
                borderColor: "rgba(255,0,0,0.1)",
            },
            {
                label: 'TSA',
                data: [83.5, 2, 3],
                backgroundColor: "rgba(33,158,188,0.5)",
                borderColor: "rgba(255,0,0,0.1)",
            },
        ]
    },
    options: {
        scales: {
            x: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                    min: 0,
                    max: 100,
                }
            }],
            y: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

new Chart(dn2, {
    type: 'bar',
    data: {
        labels: ["2 | Fixation de la tête"],
        datasets: [
            {
                label: 'DT',
                data: [74, 2, 3],
                backgroundColor: "rgba(251,133,0,0.5)",
                borderColor: "rgba(255,0,0,0.1)",
            },
            {
                label: 'TSA',
                data: [85, 2, 3],
                backgroundColor: "rgba(33,158,188,0.5)",
                borderColor: "rgba(255,0,0,0.1)",
            },
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

new Chart(dn3, {
    type: 'bar',
    data: {
        labels: ["3 | Fixation des yeux"],
        datasets: [
            {
                label: 'DT',
                data: [10, 2, 3],
                backgroundColor: "rgba(251,133,0,0.5)",
                borderColor: "rgba(255,0,0,0.1)",
            },
            {
                label: 'TSA',
                data: [20, 2, 3],
                backgroundColor: "rgba(33,158,188,0.5)",
                borderColor: "rgba(255,0,0,0.1)",
            },
        ]
    },
    options: {
        scales: {
            x: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                    min: 0,
                    max: 100,
                }
            }],
            y: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});