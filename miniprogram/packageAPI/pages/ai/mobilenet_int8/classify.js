
const modelWidth = 224.0;
const modelHeight = 224.0;
const modelChannel = 3;

var inferenceStart;
var inferenceEnd;

const classNames = {
  c0: "tench, Tinca tinca",
  c1: "goldfish, Carassius auratus",
  c2: "great white shark, white shark, man-eater, man-eating shark, Carcharodon carcharias",
  c3: "tiger shark, Galeocerdo cuvieri",
  c4: "hammerhead, hammerhead shark",
  c5: "electric ray, crampfish, numbfish, torpedo",
  c6: "stingray",
  c7: "cock",
  c8: "hen",
  c9: "ostrich, Struthio camelus",
  c10: "brambling, Fringilla montifringilla",
  c11: "goldfinch, Carduelis carduelis",
  c12: "house finch, linnet, Carpodacus mexicanus",
  c13: "junco, snowbird",
  c14: "indigo bunting, indigo finch, indigo bird, Passerina cyanea",
  c15: "robin, American robin, Turdus migratorius",
  c16: "bulbul",
  c17: "jay",
  c18: "magpie",
  c19: "chickadee",
  c20: "water ouzel, dipper",
  c21: "kite",
  c22: "bald eagle, American eagle, Haliaeetus leucocephalus",
  c23: "vulture",
  c24: "great grey owl, great gray owl, Strix nebulosa",
  c25: "European fire salamander, Salamandra salamandra",
  c26: "common newt, Triturus vulgaris",
  c27: "eft",
  c28: "spotted salamander, Ambystoma maculatum",
  c29: "axolotl, mud puppy, Ambystoma mexicanum",
  c30: "bullfrog, Rana catesbeiana",
  c31: "tree frog, tree-frog",
  c32: "tailed frog, bell toad, ribbed toad, tailed toad, Ascaphus trui",
  c33: "loggerhead, loggerhead turtle, Caretta caretta",
  c34: "leatherback turtle, leatherback, leathery turtle, Dermochelys coriacea",
  c35: "mud turtle",
  c36: "terrapin",
  c37: "box turtle, box tortoise",
  c38: "banded gecko",
  c39: "common iguana, iguana, Iguana iguana",
  c40: "American chameleon, anole, Anolis carolinensis",
  c41: "whiptail, whiptail lizard",
  c42: "agama",
  c43: "frilled lizard, Chlamydosaurus kingi",
  c44: "alligator lizard",
  c45: "Gila monster, Heloderma suspectum",
  c46: "green lizard, Lacerta viridis",
  c47: "African chameleon, Chamaeleo chamaeleon",
  c48: "Komodo dragon, Komodo lizard, dragon lizard, giant lizard, Varanus komodoensis",
  c49: "African crocodile, Nile crocodile, Crocodylus niloticus",
  c50: "American alligator, Alligator mississipiensis",
  c51: "triceratops",
  c52: "thunder snake, worm snake, Carphophis amoenus",
  c53: "ringneck snake, ring-necked snake, ring snake",
  c54: "hognose snake, puff adder, sand viper",
  c55: "green snake, grass snake",
  c56: "king snake, kingsnake",
  c57: "garter snake, grass snake",
  c58: "water snake",
  c59: "vine snake",
  c60: "night snake, Hypsiglena torquata",
  c61: "boa constrictor, Constrictor constrictor",
  c62: "rock python, rock snake, Python sebae",
  c63: "Indian cobra, Naja naja",
  c64: "green mamba",
  c65: "sea snake",
  c66: "horned viper, cerastes, sand viper, horned asp, Cerastes cornutus",
  c67: "diamondback, diamondback rattlesnake, Crotalus adamanteus",
  c68: "sidewinder, horned rattlesnake, Crotalus cerastes",
  c69: "trilobite",
  c70: "harvestman, daddy longlegs, Phalangium opilio",
  c71: "scorpion",
  c72: "black and gold garden spider, Argiope aurantia",
  c73: "barn spider, Araneus cavaticus",
  c74: "garden spider, Aranea diademata",
  c75: "black widow, Latrodectus mactans",
  c76: "tarantula",
  c77: "wolf spider, hunting spider",
  c78: "tick",
  c79: "centipede",
  c80: "black grouse",
  c81: "ptarmigan",
  c82: "ruffed grouse, partridge, Bonasa umbellus",
  c83: "prairie chicken, prairie grouse, prairie fowl",
  c84: "peacock",
  c85: "quail",
  c86: "partridge",
  c87: "African grey, African gray, Psittacus erithacus",
  c88: "macaw",
  c89: "sulphur-crested cockatoo, Kakatoe galerita, Cacatua galerita",
  c90: "lorikeet",
  c91: "coucal",
  c92: "bee eater",
  c93: "hornbill",
  c94: "hummingbird",
  c95: "jacamar",
  c96: "toucan",
  c97: "drake",
  c98: "red-breasted merganser, Mergus serrator",
  c99: "goose",
  c100: "black swan, Cygnus atratus",
  c101: "tusker",
  c102: "echidna, spiny anteater, anteater",
  c103: "platypus, duckbill, duckbilled platypus, duck-billed platypus, Ornithorhynchus anatinus",
  c104: "wallaby, brush kangaroo",
  c105: "koala, koala bear, kangaroo bear, native bear, Phascolarctos cinereus",
  c106: "wombat",
  c107: "jellyfish",
  c108: "sea anemone, anemone",
  c109: "brain coral",
  c110: "flatworm, platyhelminth",
  c111: "nematode, nematode worm, roundworm",
  c112: "conch",
  c113: "snail",
  c114: "slug",
  c115: "sea slug, nudibranch",
  c116: "chiton, coat-of-mail shell, sea cradle, polyplacophore",
  c117: "chambered nautilus, pearly nautilus, nautilus",
  c118: "Dungeness crab, Cancer magister",
  c119: "rock crab, Cancer irroratus",
  c120: "fiddler crab",
  c121: "king crab, Alaska crab, Alaskan king crab, Alaska king crab, Paralithodes camtschatica",
  c122: "American lobster, Northern lobster, Maine lobster, Homarus americanus",
  c123: "spiny lobster, langouste, rock lobster, crawfish, crayfish, sea crawfish",
  c124: "crayfish, crawfish, crawdad, crawdaddy",
  c125: "hermit crab",
  c126: "isopod",
  c127: "white stork, Ciconia ciconia",
  c128: "black stork, Ciconia nigra",
  c129: "spoonbill",
  c130: "flamingo",
  c131: "little blue heron, Egretta caerulea",
  c132: "American egret, great white heron, Egretta albus",
  c133: "bittern",
  c134: "crane",
  c135: "limpkin, Aramus pictus",
  c136: "European gallinule, Porphyrio porphyrio",
  c137: "American coot, marsh hen, mud hen, water hen, Fulica americana",
  c138: "bustard",
  c139: "ruddy turnstone, Arenaria interpres",
  c140: "red-backed sandpiper, dunlin, Erolia alpina",
  c141: "redshank, Tringa totanus",
  c142: "dowitcher",
  c143: "oystercatcher, oyster catcher",
  c144: "pelican",
  c145: "king penguin, Aptenodytes patagonica",
  c146: "albatross, mollymawk",
  c147: "grey whale, gray whale, devilfish, Eschrichtius gibbosus, Eschrichtius robustus",
  c148: "killer whale, killer, orca, grampus, sea wolf, Orcinus orca",
  c149: "dugong, Dugong dugon",
  c150: "sea lion",
  c151: "Chihuahua",
  c152: "Japanese spaniel",
  c153: "Maltese dog, Maltese terrier, Maltese",
  c154: "Pekinese, Pekingese, Peke",
  c155: "Shih-Tzu",
  c156: "Blenheim spaniel",
  c157: "papillon",
  c158: "toy terrier",
  c159: "Rhodesian ridgeback",
  c160: "Afghan hound, Afghan",
  c161: "basset, basset hound",
  c162: "beagle",
  c163: "bloodhound, sleuthhound",
  c164: "bluetick",
  c165: "black-and-tan coonhound",
  c166: "Walker hound, Walker foxhound",
  c167: "English foxhound",
  c168: "redbone",
  c169: "borzoi, Russian wolfhound",
  c170: "Irish wolfhound",
  c171: "Italian greyhound",
  c172: "whippet",
  c173: "Ibizan hound, Ibizan Podenco",
  c174: "Norwegian elkhound, elkhound",
  c175: "otterhound, otter hound",
  c176: "Saluki, gazelle hound",
  c177: "Scottish deerhound, deerhound",
  c178: "Weimaraner",
  c179: "Staffordshire bullterrier, Staffordshire bull terrier",
  c180: "American Staffordshire terrier, Staffordshire terrier, American pit bull terrier, pit bull terrier",
  c181: "Bedlington terrier",
  c182: "Border terrier",
  c183: "Kerry blue terrier",
  c184: "Irish terrier",
  c185: "Norfolk terrier",
  c186: "Norwich terrier",
  c187: "Yorkshire terrier",
  c188: "wire-haired fox terrier",
  c189: "Lakeland terrier",
  c190: "Sealyham terrier, Sealyham",
  c191: "Airedale, Airedale terrier",
  c192: "cairn, cairn terrier",
  c193: "Australian terrier",
  c194: "Dandie Dinmont, Dandie Dinmont terrier",
  c195: "Boston bull, Boston terrier",
  c196: "miniature schnauzer",
  c197: "giant schnauzer",
  c198: "standard schnauzer",
  c199: "Scotch terrier, Scottish terrier, Scottie",
  c200: "Tibetan terrier, chrysanthemum dog",
  c201: "silky terrier, Sydney silky",
  c202: "soft-coated wheaten terrier",
  c203: "West Highland white terrier",
  c204: "Lhasa, Lhasa apso",
  c205: "flat-coated retriever",
  c206: "curly-coated retriever",
  c207: "golden retriever",
  c208: "Labrador retriever",
  c209: "Chesapeake Bay retriever",
  c210: "German short-haired pointer",
  c211: "vizsla, Hungarian pointer",
  c212: "English setter",
  c213: "Irish setter, red setter",
  c214: "Gordon setter",
  c215: "Brittany spaniel",
  c216: "clumber, clumber spaniel",
  c217: "English springer, English springer spaniel",
  c218: "Welsh springer spaniel",
  c219: "cocker spaniel, English cocker spaniel, cocker",
  c220: "Sussex spaniel",
  c221: "Irish water spaniel",
  c222: "kuvasz",
  c223: "schipperke",
  c224: "groenendael",
  c225: "malinois",
  c226: "briard",
  c227: "kelpie",
  c228: "komondor",
  c229: "Old English sheepdog, bobtail",
  c230: "Shetland sheepdog, Shetland sheep dog, Shetland",
  c231: "collie",
  c232: "Border collie",
  c233: "Bouvier des Flandres, Bouviers des Flandres",
  c234: "Rottweiler",
  c235: "German shepherd, German shepherd dog, German police dog, alsatian",
  c236: "Doberman, Doberman pinscher",
  c237: "miniature pinscher",
  c238: "Greater Swiss Mountain dog",
  c239: "Bernese mountain dog",
  c240: "Appenzeller",
  c241: "EntleBucher",
  c242: "boxer",
  c243: "bull mastiff",
  c244: "Tibetan mastiff",
  c245: "French bulldog",
  c246: "Great Dane",
  c247: "Saint Bernard, St Bernard",
  c248: "Eskimo dog, husky",
  c249: "malamute, malemute, Alaskan malamute",
  c250: "Siberian husky",
  c251: "dalmatian, coach dog, carriage dog",
  c252: "affenpinscher, monkey pinscher, monkey dog",
  c253: "basenji",
  c254: "pug, pug-dog",
  c255: "Leonberg",
  c256: "Newfoundland, Newfoundland dog",
  c257: "Great Pyrenees",
  c258: "Samoyed, Samoyede",
  c259: "Pomeranian",
  c260: "chow, chow chow",
  c261: "keeshond",
  c262: "Brabancon griffon",
  c263: "Pembroke, Pembroke Welsh corgi",
  c264: "Cardigan, Cardigan Welsh corgi",
  c265: "toy poodle",
  c266: "miniature poodle",
  c267: "standard poodle",
  c268: "Mexican hairless",
  c269: "timber wolf, grey wolf, gray wolf, Canis lupus",
  c270: "white wolf, Arctic wolf, Canis lupus tundrarum",
  c271: "red wolf, maned wolf, Canis rufus, Canis niger",
  c272: "coyote, prairie wolf, brush wolf, Canis latrans",
  c273: "dingo, warrigal, warragal, Canis dingo",
  c274: "dhole, Cuon alpinus",
  c275: "African hunting dog, hyena dog, Cape hunting dog, Lycaon pictus",
  c276: "hyena, hyaena",
  c277: "red fox, Vulpes vulpes",
  c278: "kit fox, Vulpes macrotis",
  c279: "Arctic fox, white fox, Alopex lagopus",
  c280: "grey fox, gray fox, Urocyon cinereoargenteus",
  c281: "tabby, tabby cat",
  c282: "tiger cat",
  c283: "Persian cat",
  c284: "Siamese cat, Siamese",
  c285: "Egyptian cat",
  c286: "cougar, puma, catamount, mountain lion, painter, panther, Felis concolor",
  c287: "lynx, catamount",
  c288: "leopard, Panthera pardus",
  c289: "snow leopard, ounce, Panthera uncia",
  c290: "jaguar, panther, Panthera onca, Felis onca",
  c291: "lion, king of beasts, Panthera leo",
  c292: "tiger, Panthera tigris",
  c293: "cheetah, chetah, Acinonyx jubatus",
  c294: "brown bear, bruin, Ursus arctos",
  c295: "American black bear, black bear, Ursus americanus, Euarctos americanus",
  c296: "ice bear, polar bear, Ursus Maritimus, Thalarctos maritimus",
  c297: "sloth bear, Melursus ursinus, Ursus ursinus",
  c298: "mongoose",
  c299: "meerkat, mierkat",
  c300: "tiger beetle",
  c301: "ladybug, ladybeetle, lady beetle, ladybird, ladybird beetle",
  c302: "ground beetle, carabid beetle",
  c303: "long-horned beetle, longicorn, longicorn beetle",
  c304: "leaf beetle, chrysomelid",
  c305: "dung beetle",
  c306: "rhinoceros beetle",
  c307: "weevil",
  c308: "fly",
  c309: "bee",
  c310: "ant, emmet, pismire",
  c311: "grasshopper, hopper",
  c312: "cricket",
  c313: "walking stick, walkingstick, stick insect",
  c314: "cockroach, roach",
  c315: "mantis, mantid",
  c316: "cicada, cicala",
  c317: "leafhopper",
  c318: "lacewing, lacewing fly",
  c319: "dragonfly, darning needle, devil's darning needle, sewing needle, snake feeder, snake doctor, mosquito hawk, skeeter hawk",
  c320: "damselfly",
  c321: "admiral",
  c322: "ringlet, ringlet butterfly",
  c323: "monarch, monarch butterfly, milkweed butterfly, Danaus plexippus",
  c324: "cabbage butterfly",
  c325: "sulphur butterfly, sulfur butterfly",
  c326: "lycaenid, lycaenid butterfly",
  c327: "starfish, sea star",
  c328: "sea urchin",
  c329: "sea cucumber, holothurian",
  c330: "wood rabbit, cottontail, cottontail rabbit",
  c331: "hare",
  c332: "Angora, Angora rabbit",
  c333: "hamster",
  c334: "porcupine, hedgehog",
  c335: "fox squirrel, eastern fox squirrel, Sciurus niger",
  c336: "marmot",
  c337: "beaver",
  c338: "guinea pig, Cavia cobaya",
  c339: "sorrel",
  c340: "zebra",
  c341: "hog, pig, grunter, squealer, Sus scrofa",
  c342: "wild boar, boar, Sus scrofa",
  c343: "warthog",
  c344: "hippopotamus, hippo, river horse, Hippopotamus amphibius",
  c345: "ox",
  c346: "water buffalo, water ox, Asiatic buffalo, Bubalus bubalis",
  c347: "bison",
  c348: "ram, tup",
  c349: "bighorn, bighorn sheep, cimarron, Rocky Mountain bighorn, Rocky Mountain sheep, Ovis canadensis",
  c350: "ibex, Capra ibex",
  c351: "hartebeest",
  c352: "impala, Aepyceros melampus",
  c353: "gazelle",
  c354: "Arabian camel, dromedary, Camelus dromedarius",
  c355: "llama",
  c356: "weasel",
  c357: "mink",
  c358: "polecat, fitch, foulmart, foumart, Mustela putorius",
  c359: "black-footed ferret, ferret, Mustela nigripes",
  c360: "otter",
  c361: "skunk, polecat, wood pussy",
  c362: "badger",
  c363: "armadillo",
  c364: "three-toed sloth, ai, Bradypus tridactylus",
  c365: "orangutan, orang, orangutang, Pongo pygmaeus",
  c366: "gorilla, Gorilla gorilla",
  c367: "chimpanzee, chimp, Pan troglodytes",
  c368: "gibbon, Hylobates lar",
  c369: "siamang, Hylobates syndactylus, Symphalangus syndactylus",
  c370: "guenon, guenon monkey",
  c371: "patas, hussar monkey, Erythrocebus patas",
  c372: "baboon",
  c373: "macaque",
  c374: "langur",
  c375: "colobus, colobus monkey",
  c376: "proboscis monkey, Nasalis larvatus",
  c377: "marmoset",
  c378: "capuchin, ringtail, Cebus capucinus",
  c379: "howler monkey, howler",
  c380: "titi, titi monkey",
  c381: "spider monkey, Ateles geoffroyi",
  c382: "squirrel monkey, Saimiri sciureus",
  c383: "Madagascar cat, ring-tailed lemur, Lemur catta",
  c384: "indri, indris, Indri indri, Indri brevicaudatus",
  c385: "Indian elephant, Elephas maximus",
  c386: "African elephant, Loxodonta africana",
  c387: "lesser panda, red panda, panda, bear cat, cat bear, Ailurus fulgens",
  c388: "giant panda, panda, panda bear, coon bear, Ailuropoda melanoleuca",
  c389: "barracouta, snoek",
  c390: "eel",
  c391: "coho, cohoe, coho salmon, blue jack, silver salmon, Oncorhynchus kisutch",
  c392: "rock beauty, Holocanthus tricolor",
  c393: "anemone fish",
  c394: "sturgeon",
  c395: "gar, garfish, garpike, billfish, Lepisosteus osseus",
  c396: "lionfish",
  c397: "puffer, pufferfish, blowfish, globefish",
  c398: "abacus",
  c399: "abaya",
  c400: "academic gown, academic robe, judge's robe",
  c401: "accordion, piano accordion, squeeze box",
  c402: "acoustic guitar",
  c403: "aircraft carrier, carrier, flattop, attack aircraft carrier",
  c404: "airliner",
  c405: "airship, dirigible",
  c406: "altar",
  c407: "ambulance",
  c408: "amphibian, amphibious vehicle",
  c409: "analog clock",
  c410: "apiary, bee house",
  c411: "apron",
  c412: "ashcan, trash can, garbage can, wastebin, ash bin, ash-bin, ashbin, dustbin, trash barrel, trash bin",
  c413: "assault rifle, assault gun",
  c414: "backpack, back pack, knapsack, packsack, rucksack, haversack",
  c415: "bakery, bakeshop, bakehouse",
  c416: "balance beam, beam",
  c417: "balloon",
  c418: "ballpoint, ballpoint pen, ballpen, Biro",
  c419: "Band Aid",
  c420: "banjo",
  c421: "bannister, banister, balustrade, balusters, handrail",
  c422: "barbell",
  c423: "barber chair",
  c424: "barbershop",
  c425: "barn",
  c426: "barometer",
  c427: "barrel, cask",
  c428: "barrow, garden cart, lawn cart, wheelbarrow",
  c429: "baseball",
  c430: "basketball",
  c431: "bassinet",
  c432: "bassoon",
  c433: "bathing cap, swimming cap",
  c434: "bath towel",
  c435: "bathtub, bathing tub, bath, tub",
  c436: "beach wagon, station wagon, wagon, estate car, beach waggon, station waggon, waggon",
  c437: "beacon, lighthouse, beacon light, pharos",
  c438: "beaker",
  c439: "bearskin, busby, shako",
  c440: "beer bottle",
  c441: "beer glass",
  c442: "bell cote, bell cot",
  c443: "bib",
  c444: "bicycle-built-for-two, tandem bicycle, tandem",
  c445: "bikini, two-piece",
  c446: "binder, ring-binder",
  c447: "binoculars, field glasses, opera glasses",
  c448: "birdhouse",
  c449: "boathouse",
  c450: "bobsled, bobsleigh, bob",
  c451: "bolo tie, bolo, bola tie, bola",
  c452: "bonnet, poke bonnet",
  c453: "bookcase",
  c454: "bookshop, bookstore, bookstall",
  c455: "bottlecap",
  c456: "bow",
  c457: "bow tie, bow-tie, bowtie",
  c458: "brass, memorial tablet, plaque",
  c459: "brassiere, bra, bandeau",
  c460: "breakwater, groin, groyne, mole, bulwark, seawall, jetty",
  c461: "breastplate, aegis, egis",
  c462: "broom",
  c463: "bucket, pail",
  c464: "buckle",
  c465: "bulletproof vest",
  c466: "bullet train, bullet",
  c467: "butcher shop, meat market",
  c468: "cab, hack, taxi, taxicab",
  c469: "caldron, cauldron",
  c470: "candle, taper, wax light",
  c471: "cannon",
  c472: "canoe",
  c473: "can opener, tin opener",
  c474: "cardigan",
  c475: "car mirror",
  c476: "carousel, carrousel, merry-go-round, roundabout, whirligig",
  c477: "carpenter's kit, tool kit",
  c478: "carton",
  c479: "car wheel",
  c480: "cash machine, cash dispenser, automated teller machine, automatic teller machine, automated teller, automatic teller, ATM",
  c481: "cassette",
  c482: "cassette player",
  c483: "castle",
  c484: "catamaran",
  c485: "CD player",
  c486: "cello, violoncello",
  c487: "cellular telephone, cellular phone, cellphone, cell, mobile phone",
  c488: "chain",
  c489: "chainlink fence",
  c490: "chain mail, ring mail, mail, chain armor, chain armour, ring armor, ring armour",
  c491: "chain saw, chainsaw",
  c492: "chest",
  c493: "chiffonier, commode",
  c494: "chime, bell, gong",
  c495: "china cabinet, china closet",
  c496: "Christmas stocking",
  c497: "church, church building",
  c498: "cinema, movie theater, movie theatre, movie house, picture palace",
  c499: "cleaver, meat cleaver, chopper",
  c500: "cliff dwelling",
  c501: "cloak",
  c502: "clog, geta, patten, sabot",
  c503: "cocktail shaker",
  c504: "coffee mug",
  c505: "coffeepot",
  c506: "coil, spiral, volute, whorl, helix",
  c507: "combination lock",
  c508: "computer keyboard, keypad",
  c509: "confectionery, confectionary, candy store",
  c510: "container ship, containership, container vessel",
  c511: "convertible",
  c512: "corkscrew, bottle screw",
  c513: "cornet, horn, trumpet, trump",
  c514: "cowboy boot",
  c515: "cowboy hat, ten-gallon hat",
  c516: "cradle",
  c517: "crane",
  c518: "crash helmet",
  c519: "crate",
  c520: "crib, cot",
  c521: "Crock Pot",
  c522: "croquet ball",
  c523: "crutch",
  c524: "cuirass",
  c525: "dam, dike, dyke",
  c526: "desk",
  c527: "desktop computer",
  c528: "dial telephone, dial phone",
  c529: "diaper, nappy, napkin",
  c530: "digital clock",
  c531: "digital watch",
  c532: "dining table, board",
  c533: "dishrag, dishcloth",
  c534: "dishwasher, dish washer, dishwashing machine",
  c535: "disk brake, disc brake",
  c536: "dock, dockage, docking facility",
  c537: "dogsled, dog sled, dog sleigh",
  c538: "dome",
  c539: "doormat, welcome mat",
  c540: "drilling platform, offshore rig",
  c541: "drum, membranophone, tympan",
  c542: "drumstick",
  c543: "dumbbell",
  c544: "Dutch oven",
  c545: "electric fan, blower",
  c546: "electric guitar",
  c547: "electric locomotive",
  c548: "entertainment center",
  c549: "envelope",
  c550: "espresso maker",
  c551: "face powder",
  c552: "feather boa, boa",
  c553: "file, file cabinet, filing cabinet",
  c554: "fireboat",
  c555: "fire engine, fire truck",
  c556: "fire screen, fireguard",
  c557: "flagpole, flagstaff",
  c558: "flute, transverse flute",
  c559: "folding chair",
  c560: "football helmet",
  c561: "forklift",
  c562: "fountain",
  c563: "fountain pen",
  c564: "four-poster",
  c565: "freight car",
  c566: "French horn, horn",
  c567: "frying pan, frypan, skillet",
  c568: "fur coat",
  c569: "garbage truck, dustcart",
  c570: "gasmask, respirator, gas helmet",
  c571: "gas pump, gasoline pump, petrol pump, island dispenser",
  c572: "goblet",
  c573: "go-kart",
  c574: "golf ball",
  c575: "golfcart, golf cart",
  c576: "gondola",
  c577: "gong, tam-tam",
  c578: "gown",
  c579: "grand piano, grand",
  c580: "greenhouse, nursery, glasshouse",
  c581: "grille, radiator grille",
  c582: "grocery store, grocery, food market, market",
  c583: "guillotine",
  c584: "hair slide",
  c585: "hair spray",
  c586: "half track",
  c587: "hammer",
  c588: "hamper",
  c589: "hand blower, blow dryer, blow drier, hair dryer, hair drier",
  c590: "hand-held computer, hand-held microcomputer",
  c591: "handkerchief, hankie, hanky, hankey",
  c592: "hard disc, hard disk, fixed disk",
  c593: "harmonica, mouth organ, harp, mouth harp",
  c594: "harp",
  c595: "harvester, reaper",
  c596: "hatchet",
  c597: "holster",
  c598: "home theater, home theatre",
  c599: "honeycomb",
  c600: "hook, claw",
  c601: "hoopskirt, crinoline",
  c602: "horizontal bar, high bar",
  c603: "horse cart, horse-cart",
  c604: "hourglass",
  c605: "iPod",
  c606: "iron, smoothing iron",
  c607: "jack-o'-lantern",
  c608: "jean, blue jean, denim",
  c609: "jeep, landrover",
  c610: "jersey, T-shirt, tee shirt",
  c611: "jigsaw puzzle",
  c612: "jinrikisha, ricksha, rickshaw",
  c613: "joystick",
  c614: "kimono",
  c615: "knee pad",
  c616: "knot",
  c617: "lab coat, laboratory coat",
  c618: "ladle",
  c619: "lampshade, lamp shade",
  c620: "laptop, laptop computer",
  c621: "lawn mower, mower",
  c622: "lens cap, lens cover",
  c623: "letter opener, paper knife, paperknife",
  c624: "library",
  c625: "lifeboat",
  c626: "lighter, light, igniter, ignitor",
  c627: "limousine, limo",
  c628: "liner, ocean liner",
  c629: "lipstick, lip rouge",
  c630: "Loafer",
  c631: "lotion",
  c632: "loudspeaker, speaker, speaker unit, loudspeaker system, speaker system",
  c633: "loupe, jeweler's loupe",
  c634: "lumbermill, sawmill",
  c635: "magnetic compass",
  c636: "mailbag, postbag",
  c637: "mailbox, letter box",
  c638: "maillot",
  c639: "maillot, tank suit",
  c640: "manhole cover",
  c641: "maraca",
  c642: "marimba, xylophone",
  c643: "mask",
  c644: "matchstick",
  c645: "maypole",
  c646: "maze, labyrinth",
  c647: "measuring cup",
  c648: "medicine chest, medicine cabinet",
  c649: "megalith, megalithic structure",
  c650: "microphone, mike",
  c651: "microwave, microwave oven",
  c652: "military uniform",
  c653: "milk can",
  c654: "minibus",
  c655: "miniskirt, mini",
  c656: "minivan",
  c657: "missile",
  c658: "mitten",
  c659: "mixing bowl",
  c660: "mobile home, manufactured home",
  c661: "Model T",
  c662: "modem",
  c663: "monastery",
  c664: "monitor",
  c665: "moped",
  c666: "mortar",
  c667: "mortarboard",
  c668: "mosque",
  c669: "mosquito net",
  c670: "motor scooter, scooter",
  c671: "mountain bike, all-terrain bike, off-roader",
  c672: "mountain tent",
  c673: "mouse, computer mouse",
  c674: "mousetrap",
  c675: "moving van",
  c676: "muzzle",
  c677: "nail",
  c678: "neck brace",
  c679: "necklace",
  c680: "nipple",
  c681: "notebook, notebook computer",
  c682: "obelisk",
  c683: "oboe, hautboy, hautbois",
  c684: "ocarina, sweet potato",
  c685: "odometer, hodometer, mileometer, milometer",
  c686: "oil filter",
  c687: "organ, pipe organ",
  c688: "oscilloscope, scope, cathode-ray oscilloscope, CRO",
  c689: "overskirt",
  c690: "oxcart",
  c691: "oxygen mask",
  c692: "packet",
  c693: "paddle, boat paddle",
  c694: "paddlewheel, paddle wheel",
  c695: "padlock",
  c696: "paintbrush",
  c697: "pajama, pyjama, pj's, jammies",
  c698: "palace",
  c699: "panpipe, pandean pipe, syrinx",
  c700: "paper towel",
  c701: "parachute, chute",
  c702: "parallel bars, bars",
  c703: "park bench",
  c704: "parking meter",
  c705: "passenger car, coach, carriage",
  c706: "patio, terrace",
  c707: "pay-phone, pay-station",
  c708: "pedestal, plinth, footstall",
  c709: "pencil box, pencil case",
  c710: "pencil sharpener",
  c711: "perfume, essence",
  c712: "Petri dish",
  c713: "photocopier",
  c714: "pick, plectrum, plectron",
  c715: "pickelhaube",
  c716: "picket fence, paling",
  c717: "pickup, pickup truck",
  c718: "pier",
  c719: "piggy bank, penny bank",
  c720: "pill bottle",
  c721: "pillow",
  c722: "ping-pong ball",
  c723: "pinwheel",
  c724: "pirate, pirate ship",
  c725: "pitcher, ewer",
  c726: "plane, carpenter's plane, woodworking plane",
  c727: "planetarium",
  c728: "plastic bag",
  c729: "plate rack",
  c730: "plow, plough",
  c731: "plunger, plumber's helper",
  c732: "Polaroid camera, Polaroid Land camera",
  c733: "pole",
  c734: "police van, police wagon, paddy wagon, patrol wagon, wagon, black Maria",
  c735: "poncho",
  c736: "pool table, billiard table, snooker table",
  c737: "pop bottle, soda bottle",
  c738: "pot, flowerpot",
  c739: "potter's wheel",
  c740: "power drill",
  c741: "prayer rug, prayer mat",
  c742: "printer",
  c743: "prison, prison house",
  c744: "projectile, missile",
  c745: "projector",
  c746: "puck, hockey puck",
  c747: "punching bag, punch bag, punching ball, punchball",
  c748: "purse",
  c749: "quill, quill pen",
  c750: "quilt, comforter, comfort, puff",
  c751: "racer, race car, racing car",
  c752: "racket, racquet",
  c753: "radiator",
  c754: "radio, wireless",
  c755: "radio telescope, radio reflector",
  c756: "rain barrel",
  c757: "recreational vehicle, RV, R.V.",
  c758: "reel",
  c759: "reflex camera",
  c760: "refrigerator, icebox",
  c761: "remote control, remote",
  c762: "restaurant, eating house, eating place, eatery",
  c763: "revolver, six-gun, six-shooter",
  c764: "rifle",
  c765: "rocking chair, rocker",
  c766: "rotisserie",
  c767: "rubber eraser, rubber, pencil eraser",
  c768: "rugby ball",
  c769: "rule, ruler",
  c770: "running shoe",
  c771: "safe",
  c772: "safety pin",
  c773: "saltshaker, salt shaker",
  c774: "sandal",
  c775: "sarong",
  c776: "sax, saxophone",
  c777: "scabbard",
  c778: "scale, weighing machine",
  c779: "school bus",
  c780: "schooner",
  c781: "scoreboard",
  c782: "screen, CRT screen",
  c783: "screw",
  c784: "screwdriver",
  c785: "seat belt, seatbelt",
  c786: "sewing machine",
  c787: "shield, buckler",
  c788: "shoe shop, shoe-shop, shoe store",
  c789: "shoji",
  c790: "shopping basket",
  c791: "shopping cart",
  c792: "shovel",
  c793: "shower cap",
  c794: "shower curtain",
  c795: "ski",
  c796: "ski mask",
  c797: "sleeping bag",
  c798: "slide rule, slipstick",
  c799: "sliding door",
  c800: "slot, one-armed bandit",
  c801: "snorkel",
  c802: "snowmobile",
  c803: "snowplow, snowplough",
  c804: "soap dispenser",
  c805: "soccer ball",
  c806: "sock",
  c807: "solar dish, solar collector, solar furnace",
  c808: "sombrero",
  c809: "soup bowl",
  c810: "space bar",
  c811: "space heater",
  c812: "space shuttle",
  c813: "spatula",
  c814: "speedboat",
  c815: "spider web, spider's web",
  c816: "spindle",
  c817: "sports car, sport car",
  c818: "spotlight, spot",
  c819: "stage",
  c820: "steam locomotive",
  c821: "steel arch bridge",
  c822: "steel drum",
  c823: "stethoscope",
  c824: "stole",
  c825: "stone wall",
  c826: "stopwatch, stop watch",
  c827: "stove",
  c828: "strainer",
  c829: "streetcar, tram, tramcar, trolley, trolley car",
  c830: "stretcher",
  c831: "studio couch, day bed",
  c832: "stupa, tope",
  c833: "submarine, pigboat, sub, U-boat",
  c834: "suit, suit of clothes",
  c835: "sundial",
  c836: "sunglass",
  c837: "sunglasses, dark glasses, shades",
  c838: "sunscreen, sunblock, sun blocker",
  c839: "suspension bridge",
  c840: "swab, swob, mop",
  c841: "sweatshirt",
  c842: "swimming trunks, bathing trunks",
  c843: "swing",
  c844: "switch, electric switch, electrical switch",
  c845: "syringe",
  c846: "table lamp",
  c847: "tank, army tank, armored combat vehicle, armoured combat vehicle",
  c848: "tape player",
  c849: "teapot",
  c850: "teddy, teddy bear",
  c851: "television, television system",
  c852: "tennis ball",
  c853: "thatch, thatched roof",
  c854: "theater curtain, theatre curtain",
  c855: "thimble",
  c856: "thresher, thrasher, threshing machine",
  c857: "throne",
  c858: "tile roof",
  c859: "toaster",
  c860: "tobacco shop, tobacconist shop, tobacconist",
  c861: "toilet seat",
  c862: "torch",
  c863: "totem pole",
  c864: "tow truck, tow car, wrecker",
  c865: "toyshop",
  c866: "tractor",
  c867: "trailer truck, tractor trailer, trucking rig, rig, articulated lorry, semi",
  c868: "tray",
  c869: "trench coat",
  c870: "tricycle, trike, velocipede",
  c871: "trimaran",
  c872: "tripod",
  c873: "triumphal arch",
  c874: "trolleybus, trolley coach, trackless trolley",
  c875: "trombone",
  c876: "tub, vat",
  c877: "turnstile",
  c878: "typewriter keyboard",
  c879: "umbrella",
  c880: "unicycle, monocycle",
  c881: "upright, upright piano",
  c882: "vacuum, vacuum cleaner",
  c883: "vase",
  c884: "vault",
  c885: "velvet",
  c886: "vending machine",
  c887: "vestment",
  c888: "viaduct",
  c889: "violin, fiddle",
  c890: "volleyball",
  c891: "waffle iron",
  c892: "wall clock",
  c893: "wallet, billfold, notecase, pocketbook",
  c894: "wardrobe, closet, press",
  c895: "warplane, military plane",
  c896: "washbasin, handbasin, washbowl, lavabo, wash-hand basin",
  c897: "washer, automatic washer, washing machine",
  c898: "water bottle",
  c899: "water jug",
  c900: "water tower",
  c901: "whiskey jug",
  c902: "whistle",
  c903: "wig",
  c904: "window screen",
  c905: "window shade",
  c906: "Windsor tie",
  c907: "wine bottle",
  c908: "wing",
  c909: "wok",
  c910: "wooden spoon",
  c911: "wool, woolen, woollen",
  c912: "worm fence, snake fence, snake-rail fence, Virginia fence",
  c913: "wreck",
  c914: "yawl",
  c915: "yurt",
  c916: "web site, website, internet site, site",
  c917: "comic book",
  c918: "crossword puzzle, crossword",
  c919: "street sign",
  c920: "traffic light, traffic signal, stoplight",
  c921: "book jacket, dust cover, dust jacket, dust wrapper",
  c922: "menu",
  c923: "plate",
  c924: "guacamole",
  c925: "consomme",
  c926: "hot pot, hotpot",
  c927: "trifle",
  c928: "ice cream, icecream",
  c929: "ice lolly, lolly, lollipop, popsicle",
  c930: "French loaf",
  c931: "bagel, beigel",
  c932: "pretzel",
  c933: "cheeseburger",
  c934: "hotdog, hot dog, red hot",
  c935: "mashed potato",
  c936: "head cabbage",
  c937: "broccoli",
  c938: "cauliflower",
  c939: "zucchini, courgette",
  c940: "spaghetti squash",
  c941: "acorn squash",
  c942: "butternut squash",
  c943: "cucumber, cuke",
  c944: "artichoke, globe artichoke",
  c945: "bell pepper",
  c946: "cardoon",
  c947: "mushroom",
  c948: "Granny Smith",
  c949: "strawberry",
  c950: "orange",
  c951: "lemon",
  c952: "fig",
  c953: "pineapple, ananas",
  c954: "banana",
  c955: "jackfruit, jak, jack",
  c956: "custard apple",
  c957: "pomegranate",
  c958: "hay",
  c959: "carbonara",
  c960: "chocolate sauce, chocolate syrup",
  c961: "dough",
  c962: "meat loaf, meatloaf",
  c963: "pizza, pizza pie",
  c964: "potpie",
  c965: "burrito",
  c966: "red wine",
  c967: "espresso",
  c968: "cup",
  c969: "eggnog",
  c970: "alp",
  c971: "bubble",
  c972: "cliff, drop, drop-off",
  c973: "coral reef",
  c974: "geyser",
  c975: "lakeside, lakeshore",
  c976: "promontory, headland, head, foreland",
  c977: "sandbar, sand bar",
  c978: "seashore, coast, seacoast, sea-coast",
  c979: "valley, vale",
  c980: "volcano",
  c981: "ballplayer, baseball player",
  c982: "groom, bridegroom",
  c983: "scuba diver",
  c984: "rapeseed",
  c985: "daisy",
  c986: "yellow lady's slipper, yellow lady-slipper, Cypripedium calceolus, Cypripedium parviflorum",
  c987: "corn",
  c988: "acorn",
  c989: "hip, rose hip, rosehip",
  c990: "buckeye, horse chestnut, conker",
  c991: "coral fungus",
  c992: "agaric",
  c993: "gyromitra",
  c994: "stinkhorn, carrion fungus",
  c995: "earthstar",
  c996: "hen-of-the-woods, hen of the woods, Polyporus frondosus, Grifola frondosa",
  c997: "bolete",
  c998: "ear, spike, capitulum",
  c999: "toilet tissue, toilet paper, bathroom tissue",
};

export class Classifier {

  // 图像显示尺寸结构体 { width: Number, height: Number }
  displaySize;

  // net inference session
  session;

  // is ready
  ready;

  // the predicted class
  mPredClass = "None";

  speedTime = 0.0;

  modelInput = null;

  constructor(displaySize) {
    this.displaySize = {
      width: displaySize.width,
      height: displaySize.height,
    };

    this.modelInput = new Float32Array(modelWidth * modelHeight * modelChannel);
  
    this.ready = false;
  }

  load() {
    return new Promise((resolve, reject) => {

       const modelPath = `${wx.env.USER_DATA_PATH}/mobilenetv2_qat.onnx`;

       // 判断之前是否已经下载过onnx模型
        wx.getFileSystemManager().access({
          path: modelPath,
          success: (res) =>
          {
            console.log("file already exist at: " + modelPath)
              this.createInferenceSession(modelPath).then(() =>
              {
                resolve();
              })
          },
          fail: (res) => {
            console.error(res)

            wx.cloud.init();
            console.log("begin download model");

            const cloudPath = 'cloud://containertest-0gmw3ulnd8d9bc7b.636f-containertest-0gmw3ulnd8d9bc7b-1258211818/mobilenetv2_qat.onnx'
            this.downloadFile(cloudPath, function(r) {
              console.log(`下载进度：${r.progress}%，已下载${r.totalBytesWritten}B，共${r.totalBytesExpectedToWrite}B`)
            }).then(result => {
        
              wx.getFileSystemManager().saveFile({
                tempFilePath:result.tempFilePath,
                filePath: modelPath,
                success: (res) => { // 注册回调函数
                  console.log(res)
    
                  const modelPath = res.savedFilePath;
                  console.log("save onnx model at path: " + modelPath)

                  this.createInferenceSession(modelPath).then(() => {
                    resolve();
                  })
                },
                fail(res) {
                  console.error(res)
                  return
                }
              })
        });
          }
        })
    })
  }

  createInferenceSession(modelPath) {
    return new Promise((resolve, reject) => {
      this.session = wx.createInferenceSession({
        model: modelPath,
        /* 0: Lowest  precision e.g., LS16 + A16 + Winograd A16 + approx. math
           1: Lower   precision e.g., LS16 + A16 + Winograd off + approx. math
           2: Modest  precision e.g., LS16 + A32 + Winograd A32 + approx. math
           3: Higher  precision e.g., LS32 + A32 + Winograd A32 + approx. math
           4: Highest precision e.g., LS32 + A32 + Winograd A32 + precise math

           Higher precision always require longer time to run session
        */
        precisionLevel : 4,
        allowNPU : false,     // wheather use NPU for inference, only useful for IOS
        allowQuantize: true,  // wheather generate quantize model
      });

      // 监听error事件
      this.session.onError((error) => {
        console.error(error);
        reject(error);
      });
      this.session.onLoad(() => {
        this.ready = true;
        resolve();
      });
    })
  }

  downloadFile(fileID, onCall = () => {}) {
    return new Promise((resolve, reject) => {
      const task = wx.cloud.downloadFile({
        fileID,
        success: res => resolve(res),
        fail: e => {
          const info = e.toString()
          if (info.indexOf('abort') != -1) {
            reject(new Error('【文件下载失败】中断下载'))
          } else {
            reject(new Error('【文件下载失败】网络或其他错误'))
          }
        }
      })
      task.onProgressUpdate((res) => {
        if (onCall(res) == false) {
          task.abort()
        }
      })
    })
  }

  isReady() {
    return this.ready;
  }
  
  predClass() {
    return this.mPredClass;
  }

  // input is rgba uint8 data
  preProcess(frame, dstInput) {

    return new Promise((resolve, reject) =>
    {
      const origData = new Uint8Array(frame.data);

      const hRatio = frame.height / modelHeight;

      const wRatio = frame.width / modelWidth;

      // resize data to model input size, uint8 data to float32 data,
      // and transpose from nhwc to nchw

      const origHStride = frame.width * 4;
      const origWStride = 4;
    
      const mean = [0.485, 0.456, 0.406]

      const reverse_div = [4.367, 4.464, 4.444]  // reverse of std = [0.229, 0.224, 0.225]
      const ratio = 1 / 255.0

      const normalized_div = [ratio * reverse_div[0], ratio * reverse_div[1], ratio * reverse_div[2]];

      const normalized_mean = [mean[0] * reverse_div[0], mean[1] * reverse_div[1], mean[2] * reverse_div[2]];

      var idx = 0;
      for (var c = 0; c < modelChannel; ++c)
      {
        for (var h = 0; h < modelHeight; ++h)
        {
          const origH = Math.round(h * hRatio);

          const origHOffset = origH * origHStride;

          for (var w = 0; w < modelWidth; ++w)
          {
            const origW = Math.round(w * wRatio);

            const origIndex = origHOffset + origW * origWStride + c;

            //var val = ((origData[origIndex] * ratio) - mean[c]) * reverse_div[c];

            var val = origData[origIndex] * (normalized_div[c]) - normalized_mean[c];
            dstInput[idx] = val;

            idx++;
          }
        }
      } 

      resolve();
    });

  }
    // run inference and get the output
  async detect(frame)
  {
    return new Promise((resolve, reject) =>
    {
      this.preProcess(frame, this.modelInput).then(() => {
        const xinput = {
          shape: [1, 3, 224, 224],  // Input data shape in NCHW
          data: this.modelInput.buffer,
          type: 'float32',  // Input data type
        };

        inferenceStart = new Date().getTime()

        this.session.run({
          // Here string "input" Should be the same with the input name in onnx file
          "onnx::QuantizeLinear_0": xinput,
        })
        .then((res) => {
          inferenceEnd = new Date().getTime();
   
          this.speedTime = inferenceEnd - inferenceStart
  
          // Here use res.outputname.data, outputname 
          // Should be the same with the output name in onnx file
          let num = new Float32Array(res["1962"].data)

          var maxVar = num[0];
  
          var index = 0;
  
          for (var i = 1; i < num.length; ++i)
          {
            if (maxVar < num[i])
            {
              maxVar = num[i]   
              index = i     
            }
          }

          this.getClass(index);

          resolve();
        }).catch(error => console.log("runing error!: ", error.message));
      })

    });
  }

  getClass(index)
  {  
    const cIndex=`c${index}`
    this.mPredClass = classNames[cIndex];
  }

  getTime()
  {
    return this.speedTime;
  }
  dispose() {
    this.session.destroy();
  }
}