(function($) {
    $.fn.panzoom = function (options) {
        
        var settings = $.extend({
            width: false,
            height: false,
            zoom: 2, // Nível de zoom relativo ao tamanho do quadro.
            speed: 400,
            easing: 'swing',
            cursor: 'crosshair',
            wrapper: "<div class='panzoom wrapper'/>", 
            pan_margin: 0.6 // Porcentagem de margem relativa ao tamanho do quadro
        }, options);
        
        var that = this;
        
        return this.each(function (i,item) {
            if( item.tagName != 'IMG' ) return $.noop;
            
            var zoom = {
                width: Math.floor(settings.width * settings.zoom),
                height: Math.floor(settings.height * settings.zoom)
            };
            
            zoom.diff = {
                left: zoom.width - settings.width,
                top: zoom.height - settings.height
            };            
            
            var mouse_area = {
                width: Math.floor(settings.width * settings.pan_margin),
                height: Math.floor(settings.height * settings.pan_margin)
            };
            
            mouse_area.marginTop = Math.floor((settings.height - mouse_area.height) / 2);
            mouse_area.marginLeft = Math.floor((settings.width - mouse_area.width) / 2);
            
            var $item = $(item).wrap( settings.wrapper ).css({
                width: settings.width,
                height: settings.height,
                position: 'absolute',
                zIndex: 2,
                top: 0,
                left: 0           
            })
            .addClass('item');
            
            var $item_zoom = $(item).clone().css({
                width: zoom.width,
                height: zoom.height,
                position: 'absolute',
                zIndex: 1,
                top: 0,
                left: 0,
                display: 'none'              
            })
            .addClass('zoom')
            .insertAfter($item);
            
            var $wrapper = $(this).parent();
            
            $wrapper.css({
                display: 'block',
                width: settings.width,
                height: settings.height,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'wait'
            });
                
            $wrapper.bind('mouseover', function () {
                $item_zoom.css('display', 'block');
                $item.stop().fadeTo(settings.speed, 0);
                $item_zoom.css({top: -mouse_area.marginTop, left: -mouse_area.marginLeft});
            })
            .css('cursor', settings.cursor);
            
            $wrapper.bind('mouseout', function () {
                $item.stop().fadeTo(settings.speed, 1);
            });
            
            $wrapper.bind('mousemove', function(e) {
                var w_top = $wrapper.position().top,
                    w_left = $wrapper.position().left;
                
                var p_top = (e.pageY - mouse_area.marginTop - w_top) / mouse_area.height,
                    p_left = (e.pageX - mouse_area.marginLeft - w_left) / mouse_area.width;
                
                if(p_top > 1) p_top = 1;
                else if (p_top < 0) p_top = 0;
                
                if(p_left > 1) p_left = 1;
                else if(p_left < 0) p_left = 0;
                    
                $item_zoom.css({top: -Math.floor(zoom.diff.top * p_top), left: -Math.floor(zoom.diff.left * p_left)});
            });
            
            $wrapper.bind('mousedown', function(e) {
                e.preventDefault();
            });
        
            return $(this);
        });
    };
})(jQuery);