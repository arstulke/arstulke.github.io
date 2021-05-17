---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: page
include_indieauth: true
title: Projects
order: 1
---
On this page are hosted some private projects of mine.
Visit also my [linktree](https://linktr.ee/arne.stulken) to follow me on GitHub, LinkedIn or Instagram.

Some of the hosted projects store settings in the Cookies, LocalStorage or SessionStorage (both like Cookies) but none of the stored settings or data are transfered to any server. The settings are only stored for a more comfortable use. All applications are independent of any backend provided by me.

# LED Table
I built and developed a table which includes a transparent plate with a grid of large LED pixels.
I develeped a generic Node.js backend for controlling the colors of all LED pixels.
On [this page](/led-table/) you can try out the frontend for connecting to a table and loading plugins from NPM Registry.
The backend source files are currently not open but I plan to do so.

# LED Table Sandbox
For developing plugin scripts for the LED Table I created a [sandbox](/led-table-sandbox).
You can select the size of the grid. After the selection you are able to write and run a script for changing the colors of the pixels.
The interface to control the LEDs is the same as for the real backend of the table. **Note: The documentation is currently missing.**

# Virtual Background
In the current times is video chatting for private or corporate activities more importent then ever before.
Most of the people don't own a professional green screen or want to use one for hiding the background of their webcam.
I developed a small [page](/virtual-background) for applying different effects to your webcam background.
The current effects include a blur and a green screen.
Under the hood the [BodyPix Tensorflow] framework from Google is used to detect the background and apply some effects.
I forked the open [bodypix demo](https://storage.googleapis.com/tfjs-models/demos/body-pix/index.html),
applied some good default values/effects and minimized the count of UI controls.


{% comment %}
    <ul>
        <li><a href="https://github.com/arstulke" rel="me">Github</a></li>
    </ul>
    <link rel="authorization_endpoint" href="https://indieauth.com/auth" />
    <link rel="token_endpoint" href="https://tokens.indieauth.com/token">
{% endcomment %}
