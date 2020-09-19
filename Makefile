main: addressbook.pdf pretty

clean:
	rm -f addressbook*

pretty: $(wildcard src/*.js) $(wildcard *.py)
	./node_modules/.bin/prettier --write src/*.js --print-width 160 --tab-width 8 --use-tabs
	black */*.py

addressbook.tex: data/world.json
	python3 scripts/generate-address-book.py $< > $@

addressbook.pdf: addressbook.tex
	latexmk -xelatex $<
