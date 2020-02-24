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

    let observer = new MutationObserver(function(mutations, observer) {

        mutations.forEach(function(mutation) {

            let target = $(mutation.target);

            moveValidation(target);
            listenToCheckboxesChecked(target);

        });
    });

    observer.observe(document, {
        subtree: true,
        childList: true,
        attributes: true
    });

    /**
     * Move validation to below the input field
     * @param target
     */
    function moveValidation(target) {
        if (target.hasClass('ValidationError')) {
            let input = target.closest('.QuestionOuter').find('.QuestionBody');

            target.appendTo(input);
        }
    }

    /**
     * Set all labels in a row to match the same height
     */
    $('.SACOL tr').each(function () {

        let maxHeight = 0;

        $(this).find('td').each(function () {
            maxHeight = $(this).height() > maxHeight ? $(this).height() : maxHeight;
        });

        $(this).find('td').each(function () {
            $(this).find('.LabelWrapper label').height(maxHeight);
        });
    });

    $('select').each(function () {

        if (!$(this).closest('.select-input').length) {
            $(this).wrap('<div class="select-input"></div>');
        }

    });

    $('.MultipleAnswer.LabelPositionBELOW span').each(function () {

        if (!$(this).closest('.wrap').length) {
            $(this).wrap('<div class="wrap" style="text-align: center"></div>');
        }
    });

    const regex = RegExp(/#mandatory#/gmi);

    $('.QuestionText').each(function () {

        let questionStr = $(this).html();

        if (regex.test(questionStr)) {
            $(this).addClass('mandatory');
            $(this).html(questionStr.replace('#mandatory#', ''));
        }
    });

    $('textarea[title="Other"]').each(function () {
        $(this).hide();
    });

    function listenToCheckboxesChecked(target) {
        console.log(target);
        if (target.hasClass('q-checked')) {

            let parent = target.closest('.Selection');

            console.log(target);
            console.log(target.text());

            if (target.text() === 'Other') {
                parent.find('textarea[title="Other"]').show();
            }
        }
    }

})(jQuery);