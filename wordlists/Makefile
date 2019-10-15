TARGETS:=nl.1000.json nl.2000.json nl.3000.json nl.4000.json nl.5000.json
all: $(TARGETS)

clean:
	rm -f $(TARGETS)

nl.1000.json: nl.txt
	head -n 1000 nl.txt | cut -f2 | awk '(length <= 7)' | sed 's/^\|$$/"/g' | jq '[ . ]' | jq -s add -c > nl.1000.json

nl.2000.json: nl.txt
	head -n 2000 nl.txt | cut -f2 | awk '(length <= 7)' | sed 's/^\|$$/"/g' | jq '[ . ]' | jq -s add -c > nl.2000.json

nl.3000.json: nl.txt
	head -n 3000 nl.txt | cut -f2 | awk '(length <= 7)' | sed 's/^\|$$/"/g' | jq '[ . ]' | jq -s add -c > nl.3000.json

nl.4000.json: nl.txt
	head -n 4000 nl.txt | cut -f2 | awk '(length <= 7)' | sed 's/^\|$$/"/g' | jq '[ . ]' | jq -s add -c > nl.4000.json

nl.5000.json: nl.txt
	head -n 5000 nl.txt | cut -f2 | awk '(length <= 7)' | sed 's/^\|$$/"/g' | jq '[ . ]' | jq -s add -c > nl.5000.json

.PHONY = clean all
