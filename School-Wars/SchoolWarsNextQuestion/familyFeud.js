var questions = [];
var questionChart;

$(document).ready(function(){
    $("#csv-file").change(handleFileSelect);
    //loadChart();
});

function handleFileSelect(evt) {
    //Makes element visible
    document.getElementById("questionsContainer").style.display = "block";

    //handle File Select
    var file = evt.target.files[0];

    Papa.parse(file, { 
        complete: function(results) {
            questions = results["data"];
            console.log(questions);
        }
    });
}

function loadQuestion() {
    var randomIndex = Math.floor((Math.random() * questions.length) + 1);
    loadChart(questions[randomIndex]);
    showAnswers(questions[randomIndex]);
}

function loadChart(question) {
    var context = document.getElementById('myChart').getContext('2d');
    if(typeof questionChart !== 'undefined') {
        questionChart.destroy();
    }

    var title = question[0];
    var answers = question.filter(function(element, index, array) {
        return (index % 2 === 1);
    });
    var percentages = question.filter(function(element, index, array) {
        return (index % 2 === 0);
    });
    percentages.shift();

    questionChart = new Chart(context, {
        type: 'bar',
        data: {
            labels: answers,
            datasets: [{
                label: title,
                data: percentages,
                backgroundColor: 'rgb(75, 99, 132, 0.2)',
                borderColor: 'rgb(75, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

}

function showAnswers(question) {
    var title = question[0];
    var answers = question.filter(function(element, index, array) {
        return (index % 2 === 1);
    });
    var percentages = question.filter(function(element, index, array) {
        return (index % 2 === 0);
    });
    percentages.shift();

    var orderedList = $("#shownAnswers");
    orderedList.empty();
    for (var i = 0; i < answers.length; ++i) {
        orderedList.append(`<li>${answers[i]} <b>${percentages[i]}</b> т.</li>`);
    }
}
