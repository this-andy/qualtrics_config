(function($) {

    /**
     * Remove empty paragraphs
     */

    $('.QuestionText p:empty').remove();
    $('.QuestionText p').each(function () {
        if($(this).html().replace(/\s|&nbsp;/g, '').length === 0) {
            $(this).remove();
        }
    });

    /**
     * Remove empty QuestionBody
     */
    $('.QuestionBody:empty').remove();

    /**
     * Update next and previous button text
     */
    $('input[name="NextButton"]').val('Next page');
    $('input[name="PreviousButton"]').val('Previous page');

    /**
     * Observe DOM changes
     * @type {{prototype: MutationObserver; new(callback: MutationCallback): MutationObserver} | *}
     */
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function(mutations, observer) {

        mutations.forEach(function(mutation) {

            var target = $(mutation.target);

            moveValidation(target);

        });
    });

    observer.observe(document, {
        subtree: true,
        childList: true
    });

    /**
     * Move validation to below the input field
     * @param target
     */
    function moveValidation(target) {
        if (target.hasClass('ValidationError')) {
            var input = target.closest('.QuestionOuter').find('.QuestionBody');

            target.appendTo(input);
        }
    }

    /**
     * Set all labels in a row to match the same height
     */
    $('.SACOL tr').each(function () {

        var maxHeight = 0;

        $(this).find('td').each(function () {
            maxHeight = $(this).height() > maxHeight ? $(this).height() : maxHeight;
        });

        $(this).find('td').each(function () {
            $(this).find('.LabelWrapper label').height(maxHeight);
        });
    });



})(jQuery);