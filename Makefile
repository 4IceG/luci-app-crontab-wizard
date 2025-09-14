#
# Copyright 2025 Rafał Wabik - IceG - From eko.one.pl forum
#
# MIT License
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-crontab-wizard
LUCI_TITLE:=Crontab configurator for LuCI JS
MAINTAINER:=Rafał Wabik <4Rafal@gmail.com>
LUCI_DESCRIPTION:=Super simple graphical configurator for crontab.
LUCI_DEPENDS:=
PKG_VERSION:=1.0.1
PKG_RELEASE:=20250914
LUCI_PKGARCH:=all

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
