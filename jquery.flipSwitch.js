/*
 * @ jQuery plugin app
 */
(function($){
    $.fn.slideSelect = function(opts)
    {
        $(this).each(function(){
            var s = {
                obj : $(this),
                oVars : {
                    width : 0,
                    options : [],
                    indent:{disabled : -25, enabled : 25},
                    stateWidth:{disabled : 100, enabled : 0},
                    handleLeft:{disabled : 0, enabled : 100},
                    states : [],
                    flag : false
                },
                oDef : {
                },
                oBinds : {
                    ssWrap : undefined,
                    ss : $('<div class="slide-select"></div>'),
                    ssHandle : $('<div class="ss-handle"></div>'),
                    ssEnabled : $('<div class="ss-option"></div>'),
                    ssDisabled : $('<div class="ss-option"></div>')
                },
                oFns : {
                    init : function(){
                        s.obj.wrap('<div class="ss-wrap"></div>');
                        s.oBinds.ssWrap = s.obj.parent('.ss-wrap');
                        s.oFns.collectInfo();
                        s.obj.hide();
                        s.oFns.createSS();
                        s.oFns.calculateSize();
                        s.oFns.render(s.oBinds.ssHandle.data('selected'));
                    },

                    collectInfo : function(){
                        s.obj.find('option').each(function(iIndex, oNode){
                            s.oVars.options.push({
                                "value" : oNode.value,
                                "selected" : oNode.selected,
                                "innerHTML" : oNode.innerHTML,
                                "node" : oNode
                            })
                        });
                    },

                    createSS : function(){
                        var handleWrap = $('<div class="ss-handWrap"></div>').append(s.oBinds.ssHandle)
                            , enabled,enWidth,disabled,disWidth
                            , options = s.oVars.options
                            , clear = $('<div class="ss-clear"></div>')
                            , sizeTest = $('<div class="ss-size-test"></div>')
                            ;

                        if(options[0].value == 'false' || options[0].value == false || options[0].value == '0' || options[0].value == 0){
                            s.oBinds.ssDisabled.text(options[0].innerHTML).addClass('ss-disabled');
                            s.oBinds.ssEnabled.text(options[1].innerHTML).addClass('ss-enabled');
                            s.oVars.states = ['disabled', 'enabled'];
                        }else{
                            s.oBinds.ssDisabled.text(options[1].innerHTML).addClass('ss-disabled');
                            s.oBinds.ssEnabled.text(options[0].innerHTML).addClass('ss-enabled');
                            s.oVars.states = ['enabled','disabled'];
                        }
                        s.oBinds.ssHandle.data('selected', options[1].selected ? 1 : 0);


                        s.oBinds.ss.append(sizeTest,s.oBinds.ssDisabled,s.oBinds.ssEnabled, handleWrap, clear);
                        s.oBinds.ssWrap.append(s.oBinds.ss);

                        enWidth = sizeTest.text(s.oBinds.ssEnabled.text()).outerWidth(true)+40;
                        disWidth = sizeTest.text(s.oBinds.ssDisabled.text()).outerWidth(true)+40;
                        s.oVars.width = disWidth > enWidth ? disWidth : enWidth;
                        sizeTest.remove();
                    },

                    setSelected : function(){
                        var options = s.oVars.options;
                        options[0].selected = options[0].node.selected;
                        options[1].selected = options[1].node.selected;
                        s.oBinds.ssHandle.data('selected', options[1].selected ? 1 : 0);
                    },

                    bindControls : function(){
                        s.oBinds.ss.off('click').on('click', s.oFns.change);
                        s.obj.off('change').on('change', s.oFns.select);
                    },

                    change : function(){
                        var newVal =  s.oBinds.ssHandle.data('selected')? 0 : 1;
                        s.oBinds.ssHandle.data('selected', newVal);
                        s.oFns.select(newVal);
                    },

                    select : function(index){
                        if(typeof index === 'object'){
                            s.oFns.setSelected();
                            return s.oFns.render(s.oBinds.ssHandle.data('selected'));
                        }

                        var option = s.oVars.options[index];
                        s.obj.val(option.value);
                        return s.oFns.render(index);
                    },

                    render : function(index){
                        var toState = s.oVars.states[index];
                        var handLerPos = s.oVars.states[index ? 0 : 1];
                        s.oBinds.ssEnabled.css('textIndent', s.oVars.indent.enabled);
                        s.oBinds.ssDisabled.css('textIndent', s.oVars.indent.disabled);

                        s.oBinds.ssEnabled.stop().animate({
                            left : s.oVars.stateWidth[toState] + "%"
                        }, 'fast');
                        s.oBinds.ssDisabled.stop().animate({
                            width : s.oVars.stateWidth[toState] + "%"
                        }, 'fast');

                        s.oBinds.ssHandle.stop().animate({
                            left : s.oVars.handleLeft[handLerPos] + "%"
                        }, 'fast');
                    },

                    calculateSize : function(){
                        s.oBinds.ss.width(s.oVars.width);
                    }
                }
            };

            s.oFns.init();
            s.oFns.bindControls();
        });
    };
})(jQuery);
