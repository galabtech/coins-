

$(document).ready(function () {

    let arrCoin = [];
    let arrLiveReports = [];
    let arrIdToggleLive = [];
    let IntervalId;

    function loadPages(page) {

        waitLoad("contentContainer");
        clearInterval(IntervalId);

        $.ajax(
            {
                type: "GET",
                url: `${page}.html`,

                success: function (result) {
                    $("#contentContainer").html(result);
                    $("#searchInput").val("");
                },

                error: function (error) {

                },

                complete: function (result) {

                    if (page == "home") {
                        contentHomePage();
                    }

                    if (page == "livereport") {
                        contentLiveReport();
                    }

                    if (page == "about") {
                        contentAbout();
                    }

                }
            }
        )

    }

    loadPages("home");

    function contentHomePage() {

        $.ajax(
            {
                type: "GET",
                url: "https://api.coingecko.com/api/v3/coins/list",

                success: function (result) {
                    arrCoin = result;
                },

                error: function (error) {

                },

                complete: function (result) {

                    for (let i = 0; i < 100; i++) {
                        createCard("contentHomePage", arrCoin[i].symbol, arrCoin[i].name, arrCoin[i].id);
                    }

                    morInfoBtnEvent();
                    checkToggle();
                }

            }

        )

    }

    function contentLiveReport() {

        if (arrLiveReports.length == 0) {
            $("#contentLiveReportPage").html(`<div class="livereportMsg"> Please select coin to display on the graph! </div>`);
        }

        else {

            waitLoad("contentLiveReportPage");

            let arrCoinLive1 = [];
            let arrCoinLive2 = [];
            let arrCoinLive3 = [];
            let arrCoinLive4 = [];
            let arrCoinLive5 = [];
            let arrnNameCoinLive = [];

            function getData() {

                $.ajax({

                    type: "GET",
                    url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${arrLiveReports[0]},${arrLiveReports[1]},${arrLiveReports[2]},${arrLiveReports[3]},${arrLiveReports[4]}&tsyms=USD`,

                    success: function (result) {

                        if (result.Response == "Error") {
                            clearInterval(IntervalId);
                            $("#contentLiveReportPage").html(`<div class="livereportMsg"> No data on selected currencies - please try other coins! </div>`);
                        }

                        else {

                            $("#contentLiveReportPage").html(` <div id="chartContainer" style="height: 300px; width: 100%;"></div>`);

                            let dateNow = new Date();
                            let cuonter = 1;
                            arrnNameCoinLive = [];

                            for (let key in result) {

                                if (cuonter == 1) {
                                    arrCoinLive1.push({ x: dateNow, y: result[key].USD });
                                    arrnNameCoinLive.push(key);
                                }

                                if (cuonter == 2) {
                                    arrCoinLive2.push({ x: dateNow, y: result[key].USD });
                                    arrnNameCoinLive.push(key);
                                }

                                if (cuonter == 3) {
                                    arrCoinLive3.push({ x: dateNow, y: result[key].USD });
                                    arrnNameCoinLive.push(key);
                                }

                                if (cuonter == 4) {
                                    arrCoinLive4.push({ x: dateNow, y: result[key].USD });
                                    arrnNameCoinLive.push(key);
                                }

                                if (cuonter == 5) {
                                    arrCoinLive5.push({ x: dateNow, y: result[key].USD });
                                    arrnNameCoinLive.push(key);
                                }

                                cuonter++;
                            }

                            createGraph();

                        }

                    }

                })

            }

            IntervalId = setInterval(() => {
                getData();
            }, 2000);

            function createGraph() {

                var chart = new CanvasJS.Chart("chartContainer", {
                    exportEnabled: true,
                    animationEnabled: false,

                    title: {
                        text: "Favorite currencies"
                    },
                    axisX: {
                        valueFormatString: "HH:mm:ss",
                    },
                    axisY: {
                        title: "Coin Value",
                        suffix: "$",
                        titleFontColor: "#4F81BC",
                        lineColor: "#4F81BC",
                        labelFontColor: "#4F81BC",
                        tickColor: "#4F81BC",
                        includeZero: true,
                    },
                    toolTip: {
                        shared: true
                    },
                    legend: {
                        cursor: "pointer",
                        itemclick: toggleDataSeries,
                    },
                    data: [{
                        type: "spline",
                        name: arrnNameCoinLive[0],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrCoinLive1

                    },
                    {
                        type: "spline",
                        name: arrnNameCoinLive[1],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrCoinLive2

                    },
                    {
                        type: "spline",
                        name: arrnNameCoinLive[2],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrCoinLive3

                    },
                    {
                        type: "spline",
                        name: arrnNameCoinLive[3],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrCoinLive4

                    },
                    {
                        type: "spline",
                        name: arrnNameCoinLive[4],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrCoinLive5

                    }]

                });

                chart.render();

                function toggleDataSeries(e) {
                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false;
                    }
                    else {
                        e.dataSeries.visible = true;
                    }
                    e.chart.render();
                }

            }

        }

    }

    function contentAbout() {

        $("#contentAboutPage").html(`
        

        <div  id="aboutcard" class="card" >
        <div class="card-body">
          <h5 class="card-title">About Me</h5>
          <br></br>
          <h3 class="card-subtitle">Gal Abukarat</h3>
        

          <br></br>
          <div class="row about"> Fullstack Development student at John Bryce Isarel.
        <br></br>
          this project build as a live web site that update information about virtual currencies. <img class="myimg" src="me.JPG"/></div>

            
         
         
        </div>
      </div>

        

                `);
    }

    $("#homePageBtn").on("click", () => {

        loadPages("home");

    })

    $("#liveReportBtn").on("click", () => {

        loadPages("livereport");

    })


    $("#AboutBtn").on("click", () => {

        loadPages("about");

    })

    $("#searchBtn").on("click", () => {

        clearInterval(IntervalId);
        let valSearch = $("#searchInput").val().toLowerCase();
        let foundCoin;

        for (let i = 0; i < 100; i++) {

            if (valSearch == arrCoin[i].symbol) {
                foundCoin = arrCoin[i];
            }

        }

        if (valSearch == "") {
            loadPages("home");
        }

        else {

            if (foundCoin == undefined) {
                alert("Coin is not found!");
            }

            else {

                $("#searchInput").val("");
                $("#contentContainer").html(`
                <div class="row">
                     <div id="contentSearchPage" class="col contentSearchPage">
                 </div>
                </div>
                `);

                createCard("contentSearchPage", foundCoin.symbol, foundCoin.name, foundCoin.id);
                morInfoBtnEvent();
                checkToggle();

            }

        }

    });

    function morInfoBtnEvent() {

        var coll = document.getElementsByClassName("collapsible");
        var i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                }

                else {
                    content.style.maxHeight = 400 + "px";
                    let idCoin = $(this).next().children().attr("id");

                    waitLoad(idCoin);

                    let timeNow = Date.now();
                    let coinBackUp = JSON.parse(localStorage.getItem(idCoin));

                    if (coinBackUp != null && (timeNow - coinBackUp.ajaxTime < 120000)) {

                        contentMorInfo(idCoin, coinBackUp.image.small, coinBackUp.market_data.current_price.usd, coinBackUp.market_data.current_price.eur, coinBackUp.market_data.current_price.ils);
                    }

                    else {

                        $.ajax({

                            type: "GET",
                            url: `https://api.coingecko.com/api/v3/coins/${idCoin}`,

                            success: function (result) {
                                contentMorInfo(result.id, result.image.small, result.market_data.current_price.usd, result.market_data.current_price.eur, result.market_data.current_price.ils);
                            },

                            complete: function (result) {
                                result.responseJSON.ajaxTime = Date.now();
                                localStorage.setItem(result.responseJSON.id, JSON.stringify(result.responseJSON));
                            }

                        })

                    }

                }

            });

        }

    }

    function contentMorInfo(idElement, srcImg, priceUsd, priceEur, priceIls) {


        $(`#${idElement}`).html(`
        
        <div class= infocard id =infocard>
            <div class="row morInfoCollapser">
                <div class="col"> <img src=${srcImg} /> </div>
            </div>

            <div class="row morInfoCollapser">
                <div class="col price">Price:</div>
            </div>

            <div class="row morInfoCollapser">
                <div class="col">USD: ${priceUsd.toFixed(15)} $</div>
            </div>

            <div class="row morInfoCollapser">
                <div class="col">EUR: ${priceEur.toFixed(15)} €</div>
            </div>

            <div class="row morInfoCollapser">
                <div class="col">ILS: ${priceIls.toFixed(15)} ₪</div>
            </div>
            </div>
            `);

    }


    function createCard(idElement, symbolCoin, nameCoin, idCoin) {

        $(`#${idElement}`).append(`
      
            <div id="card" >
                <div class="card-body">
                        <h5 class="card-title">${symbolCoin.toUpperCase()}</h5>
                        <div class="toggleBtn">
                            <label class="switch">
                                <input id="${idCoin}-toggle" type="checkbox">
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <p class="card-text">${nameCoin}</p>
                        <button class="collapsible">More info</button>
                        <div class="content">
                            <div id=${idCoin} class="morInfo"></div> 
                        </div>                                                    
                </div>
           
            </div>`

        );

        switchToggleEvent(idCoin, symbolCoin);

    }

    function waitLoad(idElement) {

        $(`#${idElement}`).html(`
        <div class="text-center">
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
        </div>
        `)

    }

    function switchToggleEvent(idElement, symbolCoin) {

        $(`#${idElement}-toggle`).on("change", () => {

            let newSymbolCoin = symbolCoin.toUpperCase();
            let indexSymbolCoin = arrLiveReports.indexOf(newSymbolCoin);
            let indexIdToggleLive = arrIdToggleLive.indexOf(`${idElement}-toggle`);

            if (indexSymbolCoin != -1) {
                arrLiveReports.splice(indexSymbolCoin, 1);
                arrIdToggleLive.splice(indexIdToggleLive, 1);
            }

            else {

                if (arrLiveReports.length < 5) {
                    arrLiveReports.push(newSymbolCoin);
                    arrIdToggleLive.push(`${idElement}-toggle`);
                }

                else {

                    $(`#${idElement}-toggle`).prop('checked', false);

                    $("#modalWindow").html(`
                    
                    <div id="Modal" >
                        <div class="modal-content">
                            <span id="close" class="close">&times;</span>
                            <div id="coinConten" class="coinConten">
                            <div class="row modalMessage">
                              <div id="colmodal">Unable to add <span class="coinAdd">'${symbolCoin.toUpperCase()}'</span> coin - max 5 coins on live reports.</div>
                            </div>
                            <div class="row modalMessage">
                              <div class="colmodal">Press on one of selected coins to replace or cnacel.</div>
                            </div>
                        </div>
                    </div>
                    
                    `)

                    $("#Modal").css("display", "block");

                    $("#close").on("click", () => {
                        $("#Modal").css("display", "none");
                    })

                    let cuonterId = 1;

                    for (let i = 0; i < arrLiveReports.length; i++) {

                        $("#coinConten").append(`   
                        <div class="row">
                            <div class="card col" style="width: 18rem;">
                                <div class="card-body">
                                    <h5 class="card-title">${arrLiveReports[i]}</h5>
                                    <div class="toggleBtn">
                                        <label class="switch">
                                            <input id="toggle-Chose${cuonterId}" type="checkbox">
                                            <span class="slider round"></span>
                                        </label>
                                    </div>                                          
                                </div>
                            </div>
                         </div>
                        `);

                        $(`#toggle-Chose${cuonterId}`).prop('checked', true);

                        $(`#toggle-Chose${cuonterId}`).on("change", () => {

                            let indexCoinRemove = arrLiveReports.indexOf(arrLiveReports[i]);
                            let ToggleTofalse = arrIdToggleLive[indexCoinRemove];
                            arrLiveReports.splice(indexCoinRemove, 1);
                            arrIdToggleLive.splice(indexCoinRemove, 1);

                            arrLiveReports.push(symbolCoin.toUpperCase());
                            arrIdToggleLive.push(`${idElement}-toggle`);

                            $("#Modal").css("display", "none");
                            $(`#${ToggleTofalse}`).prop('checked', false);
                            checkToggle();
                        })
                        cuonterId++;
                    }

                }

            }

        })

    }

    function checkToggle() {

        for (let i = 0; i < arrIdToggleLive.length; i++) {

            $(`#${arrIdToggleLive[i]}`).prop('checked', true);

        }

    }

});

