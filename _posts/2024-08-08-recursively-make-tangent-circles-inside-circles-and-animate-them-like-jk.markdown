---
layout: post
title:  "How to recursively make tangent circles inside circles and animate them like JK"
date:   2024-08-08 12:00:00 +0200
categories: blog what-you-need-to
---
<script type="module" src="{{ site.baseurl }}{% link mngassets/posts/2024-08-08-how-to-recursively-make-circles-inside-circles-and-animate-them-like-j/js/main.js %}"></script>
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/styles/table-code-highlight.css %}">
<style>
  .guiprojectsect{
    display:grid;
    grid-template-columns: [control]245px [rest] auto;
    grid-template-row:[row1] auto [row2] auto;
  }
  .guiprojectgui{
    grid-column-start: control;
    grid-column-end: rest;
    grid-row-start: span row1;
  }
  .guiprojectcanvas{
    grid-column-start: 1;
    grid-row-start: span row2;
  }
  @media only screen and (max-width: 600px) {
    .guiprojectcanvas{
      margin-top: 50px;
    }
  }
  </style>

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="jOMROaB" data-pen-title="Recursive Circles III" data-user="DonKarlssonSan" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/DonKarlssonSan/pen/jOMROaB">
  Recursive Circles III</a> by Johan Karlsson (<a href="https://codepen.io/DonKarlssonSan">@DonKarlssonSan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Some people find circles a fascinating shape. Circles are surrounded by mathematical paradigms. For example: did you know that even if circles are closed curves they still are ruled by one of the most interesting irrational numbers, Pi, which is a [transcendental number](https://en.wikipedia.org/wiki/Transcendental_number)?

And if you are a fan of circles, why not having several of them, recursively?

This is what JK, or Johan Karlsson, one of my favorites [artist in Codepen](https://codepen.io/DonKarlssonSan), did for one of his series for the 2021 edition of [Genuary](https://genuary.art/): "Recursive Circles III".

Questions that I had when looking at his project were:

*How did he organize his code?*

*How did JK manage to get those circles inside other circles?*

*How did he make the recursion?*

*And how did he make them rotate in harmony?*

In this post I will try to re-verse the code to get some answers to my questions. I will include quick visuals using a carousel and also the [canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

> I want to share some carousels I found when working on this project (POST IN PREPARATION)

# The Code

There are many other more advanced projects about recursivity and circles, but I chose JK's one because I like his projects and the way he codes. He is usually on the search of striking patterns based on few geometric forms, all with very simple code using vanilla Javascript.

The whole implementation for this project was truly simple: A very simple css, a one-line html and a javascript of just 58 lines of prettified code, including empty lines.

Let's put some attention to the JS code.


#### Code Composition and Organization

The code consists of:

* A canvas instantiation function
* Canvas circles using the `arc` method
* Some lines of code to control for the position and rotation of the circles
* Recursive calls of the drawing function, with a clear termination
* A `draw` function

JK started his code with an instantiation of the canvas:

<div class="codetable-wrap" style="width:auto; overflow-x: auto;">
<table>
<colgroup>
<col width="5%" />
<col width="95%" />
</colgroup>
<tbody>
<tr>
<td style="padding:0px; position:sticky; left:0; opacity:0.70;">
<div class="language-javascript highlighter-rouge col01">
<div class="highlight" style="margin:0px">
<pre class="highlight col01" style="margin:0px;">
<code class="col01">  6
  7
  8
  9
 10
 11
<span style="color:yellow;"> 12 </span>
 13
 14
 15
 16
 17
 18
<span style="color:yellow;"> 19 </span>
 20
 21
 22
 23</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02">
<span class="kd">let</span> <span class="nx">canvas</span><span class="p">;</span>
<span class="kd">let</span> <span class="nx">ctx</span><span class="p">;</span>
<span class="kd">let</span> <span class="nx">w</span><span class="p">,</span> <span class="nx">h</span><span class="p">;</span>
<span class="kd">let</span> <span class="nx">shrinkFactor</span><span class="p">;</span>

<span class="kd">function</span> <span class="nx">setup</span><span class="p">()</span> <span class="p">{</span>
  <span class="nx">canvas</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">querySelector</span><span class="p">(</span><span class="dl">"</span><span class="s2">#canvas</span><span class="dl">"</span><span class="p">);</span>
  <span class="nx">ctx</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">getContext</span><span class="p">(</span><span class="dl">"</span><span class="s2">2d</span><span class="dl">"</span><span class="p">);</span>
  <span class="nx">resize</span><span class="p">();</span>                                 <span class="code-note"><em><-- <code>resize</code> is called inside <code>setup</code>...</em></span>
  <span class="nb">window</span><span class="p">.</span><span class="nx">addEventListener</span><span class="p">(</span><span class="dl">"</span><span class="s2">resize</span><span class="dl">"</span><span class="p">,</span> <span class="nx">resize</span><span class="p">);</span><span class="code-note"><em><--... and linked to a global event.</em></span>
<span class="p">}</span>

<span class="kd">function</span> <span class="nx">resize</span><span class="p">()</span> <span class="p">{</span>
  <span class="nx">w</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="nb">window</span><span class="p">.</span><span class="nx">innerWidth</span><span class="p">;</span>
  <span class="nx">h</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">height</span> <span class="o">=</span> <span class="nb">window</span><span class="p">.</span><span class="nx">innerHeight</span><span class="p">;</span>
<span class="p">}</span>
</code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

The code above includes the declaration of some high-scope variables, the initialization of the canvas instance
and the resize function. The code doesn't have anything extraordinary: it is really standard, simple and organized.

The following is where the animation takes place:

<div class="codetable-wrap" style="width:auto; overflow-x: auto;">
<table>
<colgroup>
<col width="5%" />
<col width="95%" />
</colgroup>
<tbody>
<tr>
<td style="padding:0px; position:sticky; left:0; opacity:0.70;">
<div class="language-javascript highlighter-rouge col01">
<div class="highlight" style="margin:0px">
<pre class="highlight col01" style="margin:0px;">
<code class="col01"> 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
<span style="color:yellow;"> 35</span>
 36
 37
 38
<span style="color:yellow;"> 39</span>
 40
 41
 42
<span style="color:yellow;"> 43</span>
 44
 45
 46</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02">
<span class="kd">function</span> <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">x</span><span class="p">,</span> <span class="nx">y</span><span class="p">,</span> <span class="nx">r</span><span class="p">,</span> <span class="nx">angle</span><span class="p">,</span> <span class="nx">iteration</span><span class="p">)</span> <span class="p">{</span>
  <span class="k">if</span><span class="p">(</span><span class="nx">iteration</span> <span class="o">&lt;</span> <span class="mi">0</span><span class="p">)</span> <span class="k">return</span><span class="p">;</span>
  
  <span class="kd">let</span> <span class="nx">newR</span> <span class="o">=</span> <span class="nx">r</span> <span class="o">*</span> <span class="nx">shrinkFactor</span><span class="p">;</span>
  <span class="nx">ctx</span><span class="p">.</span><span class="nx">beginPath</span><span class="p">();</span>
  <span class="nx">ctx</span><span class="p">.</span><span class="nx">arc</span><span class="p">(</span><span class="nx">x</span><span class="p">,</span> <span class="nx">y</span><span class="p">,</span> <span class="nx">r</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">2</span><span class="p">);</span>
  <span class="nx">ctx</span><span class="p">.</span><span class="nx">stroke</span><span class="p">();</span>
  
  <span class="kd">let</span> <span class="nx">r2</span> <span class="o">=</span> <span class="nx">r</span> <span class="o">-</span> <span class="nx">newR</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">x1</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">x</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">y1</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">y</span><span class="p">;</span>
  <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">x1</span><span class="p">,</span> <span class="nx">y1</span><span class="p">,</span> <span class="nx">newR</span><span class="p">,</span> <span class="nx">angle</span> <span class="o">*</span> <span class="mf">1.1</span><span class="p">,</span> <span class="nx">iteration</span> <span class="o">-</span> <span class="mi">1</span><span class="p">);</span><span class="code-note"><em><-- Magic number: <code>angle*1.1</code></em></span>
  
  <span class="kd">let</span> <span class="nx">x2</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">2</span> <span class="o">/</span> <span class="mi">3</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">x</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">y2</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">2</span> <span class="o">/</span> <span class="mi">3</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">y</span><span class="p">;</span>
  <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">x2</span><span class="p">,</span> <span class="nx">y2</span><span class="p">,</span> <span class="nx">newR</span><span class="p">,</span> <span class="nx">angle</span> <span class="o">*</span> <span class="mf">1.2</span><span class="p">,</span> <span class="nx">iteration</span> <span class="o">-</span> <span class="mi">1</span><span class="p">);</span><span class="code-note"><em><-- Magic number: <code>angle*1.2</code></em></span>
  
  <span class="kd">let</span> <span class="nx">x3</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">4</span> <span class="o">/</span> <span class="mi">3</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">x</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">y3</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">4</span> <span class="o">/</span> <span class="mi">3</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">y</span><span class="p">;</span>
  <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">x3</span><span class="p">,</span> <span class="nx">y3</span><span class="p">,</span> <span class="nx">newR</span><span class="p">,</span> <span class="nx">angle</span> <span class="o">*</span> <span class="mf">1.3</span><span class="p">,</span> <span class="nx">iteration</span> <span class="o">-</span> <span class="mi">1</span><span class="p">);</span><span class="code-note"><em><-- Magic number: <code>angle*1.3</code></em></span>

<span class="p">}</span>
</code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

A magic constant here is the argument related to `iterations`, which control the depth of the recursions, and have a particular effect on performance (*relevant!*). He also make use of "magic numbers" to modify the values of the angles when recursively calling the function.

The last function he declared was the `draw` function, accepting an argument (a time-based one):

<div class="codetable-wrap" style="width:auto; overflow-x: auto;">
<table>
<colgroup>
<col width="5%" />
<col width="95%" />
</colgroup>
<tbody>
<tr>
<td style="padding:0px; position:sticky; left:0; opacity:0.70;">
<div class="language-javascript highlighter-rouge col01">
<div class="highlight" style="margin:0px">
<pre class="highlight col01" style="margin:0px;">
<code class="col01"> 46
 47
 48
 49
 50
<span style="color:yellow;"> 51</span>
<span style="color:yellow;"> 52</span>
<span style="color:yellow;"> 53</span>
 54
 55
 56</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02">
<span class="kd">function</span> <span class="nx">draw</span><span class="p">(</span><span class="nx">now</span><span class="p">)</span> <span class="p">{</span>
  <span class="nx">requestAnimationFrame</span><span class="p">(</span><span class="nx">draw</span><span class="p">);</span>
  <span class="nx">ctx</span><span class="p">.</span><span class="nx">fillStyle</span> <span class="o">=</span> <span class="dl">"</span><span class="s2">white</span><span class="dl">"</span><span class="p">;</span>
  <span class="nx">ctx</span><span class="p">.</span><span class="nx">fillRect</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">w</span><span class="p">,</span> <span class="nx">h</span><span class="p">);</span>
  <span class="nx">shrinkFactor</span> <span class="o">=</span> <span class="mf">0.463</span><span class="p">;</span>            <span class="code-note"><em><-- Magic number: <code>shrinkFactor = 0.463</code></em></span>
  <span class="kd">let</span> <span class="nx">r</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">min</span><span class="p">(</span><span class="nx">w</span><span class="p">,</span> <span class="nx">h</span><span class="p">)</span> <span class="o">*</span> <span class="mf">0.475</span><span class="p">;</span>  <span class="code-note"><em><-- Magic number: <code>(...)*0.475</code></em></span>
  <span class="kd">let</span> <span class="nx">angle</span> <span class="o">=</span> <span class="nx">now</span> <span class="o">/</span> <span class="mi">2000</span><span class="p">;</span>          <span class="code-note"><em><-- Magic number: <code>now/2000</code></em></span>
  <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">w</span> <span class="o">/</span> <span class="mi">2</span><span class="p">,</span> <span class="nx">h</span> <span class="o">/</span> <span class="mi">2</span><span class="p">,</span> <span class="nx">r</span><span class="p">,</span> <span class="nx">angle</span><span class="p">,</span> <span class="mi">6</span><span class="p">);</span>
<span class="p">}</span>

</code></pre></div></div>
</td>
</tr>
</tbody>
</table>
</div>

Notice that in the `draw` function there are more configurations. In particular, there are some "magic numbers": 
* the **`shrinkFactor`**, 
* one associated to the value of `r`, and 
* another associated to the `angle`.

we will discuss them later.

I would rather finish this section by highlighting for such a simple and small script how JK's code managed to show a couple of good practices, particularly in terms of code organization and readability. His approach seems a minimalistic one, even in his choices for the naming conventions.

In general the code structure selected for this project, as well as other projects by the same author, reminds me a bit the typical organization pattern I have found in many other canvas projects. In particular, it appears to be inspired very much on the typical P5.js pattern:

<div class="language-javascript highlighter-rouge"><div class="highlight col02"><pre class="highlight col02"><code class="col02"><span class="c1">//variables for color change</span>
<span class="kd">let</span> <span class="nx">redVal</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
<span class="kd">let</span> <span class="nx">greenVal</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
<span class="c1">//variable for sun position</span>
<span class="kd">let</span> <span class="nx">sunHeight</span> <span class="o">=</span> <span class="mi">600</span><span class="p">;</span> <span class="c1">//point below horizon</span>

<span class="kd">function</span> <span class="nx">setup</span><span class="p">()</span> <span class="p">{</span>
<span class=""> </span> <span class="nx">createCanvas</span><span class="p">(</span><span class="mi">600</span><span class="p">,</span> <span class="mi">400</span><span class="p">);</span>
<span class=""> </span> <span class="nx">noStroke</span><span class="p">();</span> <span class="c1">//removes shape outlines</span>
<span class="p">}</span>

<span class="kd">function</span> <span class="nx">draw</span><span class="p">()</span> <span class="p">{</span>
<span class="">  </span><span class="c1">// call sky function</span>
<span class="">  </span><span class="nx">sky</span><span class="p">();</span>

<span class=""> </span> <span class="c1">// a function for the sun;</span>
<span class=""> </span> <span class="c1">// a function for the mountains;</span>

<span class="">  </span><span class="c1">// a function to update the variables</span>
<span class="p">}</span>

<span class="c1">// A function to draw the sky</span>
<span class="kd">function</span> <span class="nx">sky</span><span class="p">()</span> <span class="p">{</span>
<span class=""> </span> <span class="nx">background</span><span class="p">(</span><span class="nx">redVal</span><span class="p">,</span> <span class="nx">greenVal</span><span class="p">,</span> <span class="mi">0</span><span class="p">);</span>
<span class="p">}</span>
</code></pre></div></div>
(*From [P5.js website (tutorials)](https://p5js.org/tutorials/organizing-code-with-functions/)*)

#### Workflow's Blocks

By evaluating the final product, you could almost discerned from the code the problems that JK had to solve. We could separate the workflow in 3 different problems, or steps:
* **The mathematical problem of inserting circles inside circles**.
* **The recursive function**.
* **The animation**.

However, maybe because the rush to get his daily project done for the creative coding month, the no-point-to-re-invent-the-wheel, and why not, JK left a few things unexplained in the code. Instead, he resourced to the use of magic shortcuts in the form of pre-calculated values. We would be better able to offer insightful explanations for the workflow if we revealed the origins of such values.

The most important of all of them is the value of `shrinkFactor`.


#### *`shrinkFactor`: Solving the "Three circles inside a circle" problem*

The project is based on a repetitive pattern consisting in repeatively inserting three circles inside a circle. Probably before starting, JK might had to solve first how to do insert those circles.

The `shrinkFactor` value is used to re-calculate the size of `r` of all the inner circles at any recursion. Now, instead of coding the solution to get the value, JK used the result of a mathematical solution. I refer to it as a "magic number" because it is a constant proportion that stay the same for circles of any size. So solving for one gives you a solution you can use for all of them.

Now, to calculate the inner circles he needed to get the position of the centers. Those are the coordinates calculated as `(x1,y1)`, `(x2,y2)`,  and  `(x3,y3)`. This is done with a code that is repeated for each center. Here is one of them:
<div class="codetable-wrap" style="width:auto; overflow-x: auto;">
<table>
<colgroup>
<col width="5%" />
<col width="95%" />
</colgroup>
<tbody>
<tr>
<td style="padding:0px; position:sticky; left:0; opacity:0.70;">
<div class="language-javascript highlighter-rouge col01">
<div class="highlight" style="margin:0px">
<pre class="highlight col01" style="margin:0px;">
<code class="col01"> 32
 33
 34</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02">  <span class="kd">let</span> <span class="nx">r2</span> <span class="o">=</span> <span class="nx">r</span> <span class="o">-</span> <span class="nx">newR</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">x1</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">x</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">y1</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">y</span><span class="p">;</span></code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

Where `r2` might have a misleading name, as it is not a radius but *the distance between the center of the outer circle to the center of each of the inner circles*.

But how did he come to that value of `shrinkFactor`?

Well... it turns out that it is a very common secondary-school problem. You can find exactly the same problem and its geometric solution by [following this link](https://thinkib.net/mathanalysis/page/27758/3-circles-inside-a-circle).

<img src="{{site.baseurl}}{% link /mngassets/posts/2024-08-08-how-to-recursively-make-circles-inside-circles-and-animate-them-like-j/img/circlesinacircle 2024-08-08.png %}" style="width:100%;">
*Source*: [thinkib](https://thinkib.net/mathanalysis/page/27758/3-circles-inside-a-circle)

Let's follow the reasoning step by step:


<section id="section01">
<style>
#section01 {
  margin: 1rem;
  position: relative;
  overflow: hidden;
}
.slides-container {
  /*height: calc(40vh - 2rem);*/
  /*height: 350px;*/
  width: 100%;
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
  list-style: none;
  margin: 0;
  padding: 0;
}
.slide-arrow {
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 4rem;
  background-color: white;
  border: none;
  width: 2rem;
  font-size: 3rem;
  padding: 0;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 100ms;
}
.slide-arrow:hover,
.slide-arrow:focus {
  opacity: 1;
}
#slide-arrow-prev {
  left: 0;
  padding-left: 0.25rem;
  border-radius: 0 2rem 2rem 0;
}
#slide-arrow-next {
  right: 0;
  padding-left: 0.75rem;
  border-radius: 2rem 0 0 2rem;
}
.slide {
  width: 100%;
  height: 100%;
  flex: 1 0 100%;
  align-items: stretch;
}
.slide:nth-child(4n+1) {
  background-color: #49b293;
}.slide:nth-child(4n+2) {
  background-color: #b03532;
}
.slide:nth-child(4n+3) {
  background-color: #6a478f;
  margin: 0;
}
.slide:nth-child(4n+4) {
  background-color: #da6f2b;
}
.imgadj{
  max-width:80%;
} 
/*
footer {
  padding: 1em;
  text-align: center;
  background-color: #FFDFB9;
}
footer a {
  color: inherit;
  text-decoration: none;
}
footer .heart {
  color: #DC143C;
}
*/
</style>
  <button class="slide-arrow" id="slide-arrow-prev">
    &#8249;
  </button>
  <button class="slide-arrow" id="slide-arrow-next">
    &#8250;
  </button>
  <ul class="slides-container" id="slides-container">
    <li id="s01" class="slide"><img class="imgadj" src="{{ site.baseurl }}{% link mngassets/posts/2024-08-08-how-to-recursively-make-circles-inside-circles-and-animate-them-like-j/img/kissing circles 01.svg %}"/></li>
    <li id="s02" class="slide"><img class="imgadj" src="{{ site.baseurl }}{% link mngassets/posts/2024-08-08-how-to-recursively-make-circles-inside-circles-and-animate-them-like-j/img/kissing circles 02.svg %}"/></li>
    <li id="s03" class="slide"><img class="imgadj" src="{{ site.baseurl }}{% link mngassets/posts/2024-08-08-how-to-recursively-make-circles-inside-circles-and-animate-them-like-j/img/kissing circles 03.svg %}"/></li>
    <li id="s04" class="slide"><img class="imgadj" src="{{ site.baseurl }}{% link mngassets/posts/2024-08-08-how-to-recursively-make-circles-inside-circles-and-animate-them-like-j/img/kissing circles 04.svg %}"/></li>
    <li id="s05" class="slide"><img class="imgadj" src="{{ site.baseurl }}{% link mngassets/posts/2024-08-08-how-to-recursively-make-circles-inside-circles-and-animate-them-like-j/img/kissing circles 05.svg %}"/></li>
    <li id="s06" class="slide"><img class="imgadj" src="{{ site.baseurl }}{% link mngassets/posts/2024-08-08-how-to-recursively-make-circles-inside-circles-and-animate-them-like-j/img/kissing circles 06.svg %}"/></li>
    <li id="s07" class="slide"><img class="imgadj" src="{{ site.baseurl }}{% link mngassets/posts/2024-08-08-how-to-recursively-make-circles-inside-circles-and-animate-them-like-j/img/kissing circles 07.svg %}"/></li>
    <li id="s08" class="slide"><img class="imgadj" src="{{ site.baseurl }}{% link mngassets/posts/2024-08-08-how-to-recursively-make-circles-inside-circles-and-animate-them-like-j/img/kissing circles 08.svg %}"/></li>
    <li id="s09" class="slide"><img class="imgadj" src="{{ site.baseurl }}{% link mngassets/posts/2024-08-08-how-to-recursively-make-circles-inside-circles-and-animate-them-like-j/img/kissing circles 09.svg %}"/></li>
    <li id="s10" class="slide"></li>
  </ul>
<script>
const slidesContainer = document.getElementById("slides-container");
const slide = document.querySelector(".slide");
const prevButton = document.getElementById("slide-arrow-prev");
const nextButton = document.getElementById("slide-arrow-next");
nextButton.addEventListener("click", () => {
  const slideWidth = slide.clientWidth;
  slidesContainer.scrollLeft += slideWidth;
});
prevButton.addEventListener("click", () => {
  const slideWidth = slide.clientWidth;
  slidesContainer.scrollLeft -= slideWidth;
});
</script>
</section>
For our specific case of three kissing circles, the solution to `R/r` would be:

`R/ r = ((3 + 2 * sqrt(3))/3)`

which gives the relation between the radius `R` of the containing circle against the radius `r` of any of the three inserted circles. For `r = 1`, the value of `R` is (approx) 2.155.

Inverting the proportion gives:

`r/R = 0.464`

which is the value used by JK, probably adjusted to 0.463.

> There is another way to get the same relationship by using the [Descartes' Circle Theorem](https://en.wikipedia.org/wiki/Descartes%27_theorem), where, for this particular example, reduces to  
>`(3/r - 1/R)^2 = 2(3/(r^2) + 1/(R^2))`

<br/>
<br/>
<br/>


#### `drawPattern` function: centers, radii, angles and a couple of other magic numbers

Once he got the constant relations necessary to calculate the inner circles, it should have been easier for JK to draw them.

Every time the function was used, the newR (the radius of the inner circles) was calculated.

Centers were found from the angles, which were 120 degrees (2*PI/3 radians) apart of each other, at a distance of `r - newR` from the center.

The `interation` controlled the depth of the recursion (set to 6 in the original project).

But then he also multiplied the angles by other `magic numbers` at each self call of the `drawPattern` function. Those numbers were made up and only controlled for different rotation speeds of the circles.

`angle` is actually the value of the angular speed: the magnitude of the arc that the circle should travel at each frame. The larger that value, the faster it goes.

Those "magic numbers" used by JK had as effect that several different circles rotated under different speeds, also helped by the recursive placing of the different circles.

<section class='guiprojectsect' id="sectcanvas01">
<div class='guiprojectgui' id="gui-speedexample"></div>
<canvas class='guiprojectcanvas' id="speedexample"></canvas>
<!-- USE CANVAS API WITH THE ACTUAL FUNCTION PLUS DATGUI TO MODIFY THE VALUES OF THE ENTRIES -->
</section>
<br/>
<br/>
<br/>

#### `draw` function: setting up the size of the first outer circle and the initial speed of rotation

The "magic numbers" used in the `draw` function are more mundane and don't require a lot of discussion. One was used to fit the outest circle to an appropiate size on the screen (the "0.475"). The other one, the 2000 in `let angle = now / 2000;`, was more a way to initialize the angular speed of the first inner circles.


<section class='guiprojectsect' id="sectcanvas02">
<div class='guiprojectgui' id="gui-initialsetupexample02"></div>
<canvas class='guiprojectcanvas' id="initialsetupexample02"></canvas>
</section>

# Tada!

# So... What did we learn from this code?

This was a very simple but entertaining project! And what's more: it didn't take much to prepare. So it is likely that there will be more posts like this one in the near future.

Particularly because, like this project by JK, there is a lot we can learn from just a few lines of code. And a good bunch of tools we can use to help us reveal their insides. 

# Final Remarks

For the gallery section showing the maths behind the kissing circles I originally thought to use d3.js and scrollama.js. Then I decided to make an exploration of Konva.js, but, although I liked the use of Konva, just approaching the end of the animations with Konva I found that a carousel was a better fit.

Sometimes a better solution is just the simplest one.

Yes: I wish you happy coding!

----

The carousel used for this project is the same created by [Jemima Abu](https://www.jemimaabu.com/) for [Envato TutsPlus in Codepen](https://codepen.io/tutsplus/pen/XWZqGgX), with small modifications.

The rest of the code for this project is the same by Johan Karlsson's, with added controllers using the [dat-gui](https://github.com/dataarts/dat.gui) package.

I used Inkscape for the images.