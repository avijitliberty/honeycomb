---
# An instance of the Featurette widget.
# Documentation: https://wowchemy.com/docs/page-builder/
widget: featurette

# This file represents a page section.
headless: true

# Order that this section appears on the page.
weight: 10

title: HoneyComb
subtitle:

design:
  # Choose how many columns the section has. Valid values: 1 or 2.
  columns: "1"
  background:
    # Name of image in `assets/media/`.
    image: background.jpg
    # Darken the image? Range 0-1 where 0 is transparent and 1 is opaque.
    image_darken: 0.6
    #  Options are `cover` (default), `contain`, or `actual` size.
    image_size: cover
    # Options include `left`, `center` (default), or `right`.
    image_position: center
    # Use a fun parallax-like fixed background effect on desktop? true/false
    image_parallax: true
    # Text color (true=light, false=dark, or remove for the dynamic theme color).
    text_color_light: true

# Showcase personal skills or business features.
# - Add/remove as many `feature` blocks below as you like.
# - For available icons, see: https://wowchemy.com/docs/page-builder/#icons
feature:
- description:
  icon: fab fa-docker
  icon_pack: fab
  name: Docker
  #url: /cheatsheets/docker
- description:
  icon: fab fa-aws
  icon_pack: fab
  name: AWS
  url: /cheatsheets/aws
- description:
  icon: fab fa-github
  icon_pack: fab
  name: GitHub
  url: /cheatsheets/github
- description:
  icon: fab fa-jenkins
  icon_pack: fab
  name: Jenkins
  url: /cheatsheets/jenkins

# Uncomment to use emoji icons.
#- icon: ":smile:"
#  icon_pack: "emoji"
#  name: "Emojiness"
#  description: "100%"  

# Uncomment to use custom SVG icons.
# Place custom SVG icon in `assets/images/icon-pack/`, creating folders if necessary.
# Reference the SVG icon name (without `.svg` extension) in the `icon` field.
- icon: "jfrog"
  icon_pack: "custom"
  name: "JFrog"
  description:
  url: /post/artifactory
- icon: "kubernetes"
  icon_pack: "custom"
  name: "Kubernetes"
  description:
  #url:
- icon: "spring"
  icon_pack: "custom"
  name: "SpringBoot"
  description:
  url: /cheatsheets/springboot
- icon: "centos"
  icon_pack: "custom"
  name: "Centos"
  description:
  url: /post/centos
- icon: "ubuntu"
  icon_pack: "custom"
  name: "Ubuntu"
  description:
  #url:
- icon: "vagrant"
  icon_pack: "custom"
  name: "Vagrant"
  description:
  url: /cheatsheets/vagrant
- icon: "virtualbox"
  icon_pack: "custom"
  name: "VirtualBox"
  description:
  url: /cheatsheets/virtualbox
---
