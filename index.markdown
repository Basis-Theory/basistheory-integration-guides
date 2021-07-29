---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---
<html>
  <head>
    <meta charset="utf-8">
    <title>Home</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    {{ page.title }}
  </body>
</html>

{% if page.show_sidebar %}
  <div class="sidebar">
    sidebar content
  </div>
{% endif %}