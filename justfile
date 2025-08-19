build:
    rm -rf build
    cd sphinx && uv run --group docs sphinx-build -b html . build -W
    cd landing && npm i --frozen-lockfile && npm run build
    mkdir build
    cp -R ./sphinx/build/. ./build/.
    cp -R ./landing/out/. ./build/.


build-debug:
    cd sphinx && uv run --group docs sphinx-build -b html . build -D nb_execution_raise_on_error=0

serve: build
    npm exec serve build

serve-debug: build-debug
    npm exec serve sphinx/build

clean:
    rm -rf sphinx/jupyter_execute
    rm -rf sphinx/.jupyter_cache
    rm -rf sphinx/build
    rm -rf sphinx/api/generated
    rm -rf landing/out
    rm -rf build

link-check:
    cd sphinx && uv run sphinx-build -b linkcheck . build -W

coverage:
    cd sphinx && uv run sphinx-build -W -v -b coverage . build/coverage