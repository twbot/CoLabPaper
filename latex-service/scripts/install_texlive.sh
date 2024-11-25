#!/bin/bash
set -e

# Update package list
apt-get update

# Install required packages
apt-get install -y \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-science \
    texlive-publishers \
    latexmk \
    curl

# Create local texmf directory structure
mkdir -p /texmf/tex/latex

# Update TeX database
texhash

# Clean up
apt-get clean
rm -rf /var/lib/apt/lists/*