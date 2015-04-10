#!/bin/bash

# Variables
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NORMAL='\033[0m'

VERSION="0.1"

path=$(pwd)

filename=$(basename "$0")

# Functions
end_on_fail () {
    # If no arguments were passed, return
    if [ -z "${1:-}" ]; then
        return 1
    fi

    if [ $1 -ne 0 ]; then
        echo -e "${RED}Command returned error. Exiting...${NORMAL}"
        cd ${old_path}
        exit 1
    fi
}

setup_npm() {
    (npm install)
}

build_project() {
    (cake all)
}



# Get Arguments
while [[ $# > 0 ]]
do
key="$1"

case $key in
    -v|--version)
    OPTION_VERSION="1"
    ;;
    -h|--help)
    OPTION_HELP="1"
    ;;
    -n|--npm)
    OPTION_NPM="1"
    ;;
    -b|--build)
    OPTION_BUILD="1"
    ;;
    *)
            # unknown option
    ;;
esac
shift
done

# General information
if [ -n "$OPTION_HELP" ];
then
    echo -e "${YELLOW}
    $filename v.${VERSION}

    Usage:
    ./build.sh --npm --build

    Options:
    -n|--npm            -  Setup node modules
    -b|--build          -  Build the project
    ${NORMAL}";
    exit 0
fi

if [ -n "$OPTION_VERSION" ];
then
    echo -e "${YELLOW}$filename v.${VERSION}${NORMAL}";
    exit 0
fi

if [ -n "$OPTION_VERSION" ];
then
    echo -e "${YELLOW}$filename v.${VERSION}${NORMAL}";
    exit 0
fi

# Start application

cd ${path}

echo -e "${YELLOW}Start script...${NORMAL}"

if [ -n "$OPTION_NPM" ];
then
    echo -e "${YELLOW}Setup NPM...${NORMAL}"
    setup_npm
    end_on_fail $?
    echo -e "${GREEN}Done - Setup NPM.${NORMAL}"
fi

if [ -n "$OPTION_BUILD" ];
then
    echo -e "${YELLOW}Build the project...${NORMAL}"
    build_project
    end_on_fail $?
    echo -e "${GREEN}Done - Build the project.${NORMAL}"
fi

echo -e "${GREEN}Script has finished.${NORMAL}"
