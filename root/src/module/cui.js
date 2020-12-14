class CUI{
    TextType = {
        From: 'From',
        To: 'To',
        Info: 'Info',
        Event: 'Event',
        Message: 'Msg'
    };

    addText(texttype, text) {
        const t = '<p class="cui-text">' + texttype + ': ' + text + '</p>';
        $('#cui-text-area').append(t);
        $('#cui-text-area').scrollTop($('#cui-text-area')[0].scrollHeight);
    }
}

$('#cui-clear-text-button').on('click', function(){
    $('#cui-text-area').empty();
});

$('#cui-text-area').on('click', e => {
    $('#cui-input').focus();
});

module.exports = new CUI();