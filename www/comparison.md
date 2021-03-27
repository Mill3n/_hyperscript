---
layout: layout.njk
title: ///_hyperscript
---

<script src="https://code.jquery.com/jquery-3.6.0.min.js"
  integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
  crossorigin="anonymous"></script>

# [VanillaJS](http://vanilla-js.com/) v. [jQuery](https://jquery.com/) v. [hyperscript](/)

Below are comparisons of how to implement various common UI patterns in vanilla javascript, jQuery and hyperscript.  

In general, the VanillaJS version will be the most awkward.  

The jQuery version will be better, but will separate the logic from the
element in question.  This is considered good practice by some people, in the name of [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns), but it violates [locality of behavior](https://htmx.org/essays/locality-of-behaviour/), which we feel is usually more important for system maintainability.  (If you've ever had to hunt for an obscure event handler in jQuery, you know what we mean.)  

Both the VanillaJS and JQuery verisons will often require callbacks, making for awkward expression of logic that is straight-forward and linear in hyperscript.  This becomes especially pronounced in more complex promise or callback chains.

## Comparisons

* [Fade And Remove](#fade-and-remove)
* [Fetch And Insert](#fetch-and-insert)
* [Debounced Input](#debounced-input)
* [Toggle A Class](#toggle-class)
* [Trigger An Event](#trigger-an-event)
* [Show An Element](#show-element)

## <a name='fade-and-remove'>[Fade And Remove](#fade-and-remove)

Pattern: fade and remove an element after it is clicked

#### VanillaJS

```html
<div onclick="var self = this;
              self.style.transition = 'all 500ms ease-out';
              self.style.opacity = '1'; 
              setTimeout(function(){
                self.style.opacity = '0';
                self.addEventListener('transitionend', function(){
                    self.parentNode.removeChild(self);
                }, {once:true})
              }, 1) ">
              Remove Me
</div>
```

<div onclick="var self = this;
              self.style.transition = 'all 500ms ease-out';
              self.style.opacity = '1'; setTimeout(function(){
                self.style.opacity = '0';
                self.addEventListener('transitionend', function(){
                    self.parentNode.removeChild(self);
                }, {once:true})
              }, 1) ">
              Remove Me
</div>

#### jQuery
```html
<script>
$(function(){
  $("#divToRemove").click(function(){
    $(this).fadeOut(500, function(){
        $(this).remove();
    });
  });
});
</script>
<div id="divToRemove">
              Remove Me
</div>
```

<script>
$(function(){
  $("#divToRemove").click(function(){
    $(this).fadeOut(500, function(){
        $(this).remove();
    });
  });
});
</script>
<div id="divToRemove">
              Remove Me
</div>

#### hyperscript

```html
<div _="on click transition opacity to 0 then remove me">
              Remove Me
</div>
```

<div _="on click transition opacity to 0 then remove me">
              Remove Me
</div>

## <a name='fetch-and-insert'>[Fetch And Insert](#fetch-and-insert)

Pattern: fetch some data and insert it into an element

#### VanillaJS

```html
<button onclick="fetch('/clickedMessage/')
                  .then(response => response.text())
                  .then(function(data) {
                      document.getElementById('fetch-target-1').innerHTML = data
                  })">
 Fetch It
</button>
<div id="fetch-target-1"></div>
```
<button onclick="fetch('/clickedMessage/')
                  .then(response => response.text())
                  .then(function(data) {
                     document.getElementById('fetch-target-1').innerHTML = data
                  })">
 Fetch It
</button>
<div id="fetch-target-1"></div>

#### jQuery
```html
<script>
$(function(){
  $("#fetchBtn").click(function(){
    $.get('/clickedMessage/', function(data){
        $("#fetch-target-2").html(data);
     })
  });
});
</script>
<button id="fetchBtn">
 Fetch It
</button>
<div id="fetch-target-2"></div>
```

<script>
$(function(){
  $("#fetchBtn").click(function(){
    $.get('/clickedMessage/', function(data){
        $("#fetch-target-2").html(data);
     })
  });
});
</script>
<button id="fetchBtn">
 Fetch It
</button>
<div id="fetch-target-2"></div>

#### hyperscript

```html
<button _="on click fetch /clickedMessage/ then put the result into #fetch-target-3">
 Fetch It
</button>
<div id="fetch-target-3"></div>
```

<button _="on click fetch /clickedMessage/ then put the result into #fetch-target-3">
 Fetch It
</button>
<div id="fetch-target-3"></div>

## <a name='debounced-input'>[Debounced Input](#debounced-input)

Pattern: debounce event handling to avoid triggering logic in response to multiple, shortly
spaced events

#### VanillaJS

```html
<input onkeyup="self = this;
                clearTimeout(self.debounce);
                self.debounce = setTimeout(function(){
                  document.getElementById('debounce-target-1').innerHTML = self.value;
                }, 300) "/>
<div id="debounce-target-1"></div>
```
<input placeholder="Enter Some Data..."
       onkeyup="self = this;
                clearTimeout(self.debounce);
                self.debounce = setTimeout(function(){
                  document.getElementById('debounce-target-1').innerHTML = self.value;
                }, 300) "/>
<div id="debounce-target-1"></div>

#### jQuery
```html
<script>
$(function(){
  var debounce = null;
  $("#debouncedInput").keyup(function(){
     clearTimeout(debounce);
     var self = $(this);
     debounce = setTimeout(function(){
       $('#debounce-target-2').html(self.val());
     }, 300);
  });
});
</script>
<input placeholder="Enter Some Data..."
       id="debouncedInput"/>
<div id="debounce-target-2"></div>
```

<script>
$(function(){
  var debounce = null;
  $("#debouncedInput").keyup(function(){
     clearTimeout(debounce);
     var self = $(this);
     debounce = setTimeout(function(){
       $('#debounce-target-2').html(self.val());
     }, 300);
  });
});
</script>
<input placeholder="Enter Some Data..."
       id="debouncedInput"/>
<div id="debounce-target-2"></div>

#### hyperscript

```html
<input _="on keyup debounced at 300ms put my.value into #debounce-target-3"/>
<div id="debounce-target-3"></div>
```
<input placeholder="Enter Some Data..."
       _="on keyup debounced at 300ms put my.value into #debounce-target-3"/>
<div id="debounce-target-3"></div>

## <a name='toggle-class'>[Toggle A Class](#toggle-class)

Pattern: toggle a class on another element when clicked

#### VanillaJS

<style>
.red-border {
  border: 5px solid red;
}
</style>
```html
<button onclick="document.getElementById('toggle-target-1')
                         .classList.toggle('red-border')">
  Toggle Class
</button>
<div id="toggle-target-1"></div>
```
<button onclick="document.getElementById('toggle-target-1')
                         .classList.toggle('red-border')">
  Toggle Class
</button>
<div id="toggle-target-1">
  Toggle Target
</div>

#### jQuery
```html
<script>
$(function(){
  $("#toggleBtn").click(function(){
    $("#toggle-target-2").toggleClass("red-border");
  });
});
</script>
<button id="toggleBtn">
  Toggle Class
</button>
<div id="toggle-target-2">
  Toggle Target
</div>
```

<script>
$(function(){
  $("#toggleBtn").click(function(){
    $("#toggle-target-2").toggleClass("red-border");
  });
});
</script>

<button id="toggleBtn">
  Toggle Class
</button>

<div id="toggle-target-2">
  Toggle Target
</div>

#### hyperscript

```html
<button _="on click toggle .red-border on #toggle-target-3">
  Toggle Class
</button>
<div id="toggle-target-3">
  Toggle Target
</div>
```

<button _="on click toggle .red-border on #toggle-target-3">
  Toggle Class
</button>
<div id="toggle-target-3">
  Toggle Target
</div>

## <a name='trigger-an-event'>[Trigger An Event](#trigger-an-event)

Pattern: trigger a custom event on another element in the DOM

#### VanillaJS


```html
<button onclick="document.getElementById('event-target-1')
                         .dispatchEvent(new Event('doIt'))">
  Trigger Event
</button>
<div id="event-target-1">
  Event Target
</div>
<script>
  document.getElementById('event-target-1').addEventListener("doIt", function(){
    var elt = document.getElementById('event-target-1');
    elt.parentNode.removeChild(elt)
  });
</script>
```
<button onclick="document.getElementById('event-target-1')
                         .dispatchEvent(new Event('doIt'))">
  Trigger Event
</button>
<div id="event-target-1">
  Event Target
</div>
<script>
  document.getElementById('event-target-1').addEventListener("doIt", function(){
    var elt = document.getElementById('event-target-1');
    elt.parentNode.removeChild(elt)
  });
</script>

#### jQuery
```html
<script>
$(function(){
  $("#triggerBtn").click(function(){
    $("#event-target-2").trigger("doIt");
  });
  $("#event-target-2").on('doIt', function(){
    $(this).remove();
  });
});
</script>
<button id="triggerBtn">
  Trigger Event
</button>
<div id="event-target-2">
  Event Target
</div>
```

<script>
$(function(){
  $("#triggerBtn").click(function(){
    $("#event-target-2").trigger("doIt");
  });
  $("#event-target-2").on('doIt', function(){
    $(this).remove();
  });
});
</script>

<button id="triggerBtn">
  Trigger Event
</button>

<div id="event-target-2">
  Event Target
</div>

#### hyperscript

```html
<button _="on click send doIt to #event-target-3">
  Trigger Event
</button>
<div id="event-target-3"
     _="on doIt remove me">
  Event Target
</div>
```

<button _="on click send doIt to #event-target-3">
  Trigger Event
</button>
<div id="event-target-3"
     _="on doIt remove me">
  Event Target
</div>

## <a name='show-element'>[Show An Element](#show-element)

Make an element visible by setting the `display` style to `block`

#### VanillaJS


```html
<button onclick="document.getElementById('show-target-1').style.display = 'block'">
  Show Element
</button>
<div style="display: none" id="show-target-1">
  Hidden Element
</div>
```
<button onclick="document.getElementById('show-target-1').style.display = 'block'">
  Show Element
</button>
<div style="display: none" id="show-target-1">
  Hidden Element
</div>

#### jQuery
```html
<script>
$(function(){
  $("#showBtn").click(function(){
    $("#show-target-2").show();
  });
});
</script>
<button id="showBtn">
  Show Element
</button>
<div style="display: none" id="show-target-2">
  Hidden Element
</div>
```

<script>
$(function(){
  $("#showBtn").click(function(){
    $("#show-target-2").show();
  });
});
</script>
<button id="showBtn">
  Show Element
</button>
<div style="display: none" id="show-target-2">
  Hidden Element
</div>

#### hyperscript

```html
<button _="on click show #show-target-3">
  Show Element
</button>
<div style="display: none" id="show-target-3">
  Hidden Element
</div>
```

<button _="on click show #show-target-3">
  Show Element
</button>
<div style="display: none" id="show-target-3">
  Hidden Element
</div>


<div style="height: 400px">
</div>
