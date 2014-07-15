
Application.ready(function(){
    var app = new Application('reserved')
        ;

    Application.setGlobal(app);
    var calendar = new Application.Calendar(app);

    // Hide all the views.
    $('.calendar .dates>div').addClass('hidden');
    calendar.show('month');
});
