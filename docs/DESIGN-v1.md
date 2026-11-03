# Little Discoveries Game Design for 100 iPhone Browser Levels

Source: [Design Page](https://chatgpt.com/space/page_f13e568e45148191ab41e86b66b6e5fe)

**Little Discoveries** is a personal hidden-object game with 100 original illustrated scenes, designed for relaxed play in an iPhone browser. Open the link, choose a picture, and find its objects. The entire game, every hint, and every replay are free. There are no ads, purchases, subscriptions, energy limits, or waiting periods.

The intended experience is a pleasant five-to-ten-minute break that can also turn into an uninterrupted evening of searching. Beautiful pictures and satisfying discoveries provide the reason to keep playing. This is a game design; production artwork and software are outside this scope.

## Concept and player experience

The working title is **Little Discoveries**. Its world is a collection of inviting places: sunny kitchens, flower shops, seaside villages, old libraries, and gently magical gardens. The visual tone is detailed, warm, and appealing to adults. A light travel-album structure connects the scenes; there is no required dialogue or story to advance.

The reference is Yolo Game Studios’ **Find Hidden Objects – Spot It!**. Its official listing describes picture-based searching, zoom, and untimed play; its store listing also identifies advertising and in-app purchases. Little Discoveries keeps the familiar picture-and-object-list format and uses original artwork, interfaces, and level designs. [App Store listing](https://apps.apple.com/us/app/find-hidden-objects-spot-it/id6474133872), [Google Play listing](https://play.google.com/store/apps/details?id=com.yolo.hiddenobjects).

Success means she can open the game, understand what to do without an explanation, find objects comfortably with her thumb, and finish any level without spending money or enduring an interruption. The game should still feel generous at level 100.

## Rules that apply to all 100 levels

- All 100 levels are available from the beginning. **Continue** recommends the next unfinished level, while **Choose a scene** allows any order.

- Hints, precise reveals, and optional assisted finds are unlimited and immediately available. They never require an ad, a currency, or a cooldown.

- There are no timers, lives, penalties for missed taps, scores, star ratings, streaks, or leaderboards.

- Every level can be left and resumed. Moving to another scene preserves the unfinished one.

- There is no shop, premium tier, account requirement, or purchase screen. Hosting and artwork are project costs borne by the owner, never a condition of the player’s progress.

- Completion has the same value whether she uses zero hints or twenty. Help usage is not displayed on the completion screen.

## Playing a level

1. Choose a scene or press **Continue**. The complete picture fits on screen at the starting zoom.

2. A tray shows pictures and short names of the objects to find. All required objects are present and collectible from the start, including those whose cards are currently offscreen in the tray.

3. Tap an object in the picture. A brief ring and check mark acknowledge the find; an optional quiet chime plays. The counter advances, such as **7 of 12 found**.

4. Pinch to inspect details, drag the enlarged picture, or use the zoom buttons. The picture never requires endless scrolling across a large map.

5. Use **Hint** whenever desired. Leave and return at any point.

6. Finding all required objects completes the level. A small completion panel offers **Next scene**, **Stay and look**, and **Choose a scene**.

A found object remains in the artwork so the composition does not develop holes or reveal previously covered items. It receives a subtle marker that can be hidden. Its tray card stays in place with a check mark, preventing the list from jumping while she is looking at it. An optional **Remaining only** filter shortens the tray.

Tapping a found object gives a small acknowledgement. A missed tap has no consequence. Dragging and pinching never count as guesses. Skipping a scene leaves it marked **In progress**, not completed.

## Hints and comfortable searching

| Control | Behavior |
| --- | --- |
| Tap an object card | Enlarge its exact picture and name. Select it as the target for the next hint. |
| Hint | Briefly circle a broad area containing the selected object; if none is selected, choose an unfound object. Bring that area into view when necessary. |
| Show me | Center the chosen object and outline its exact visible shape. Available immediately, even without first using a broad hint. |
| Mark found | An optional action inside the enlarged object card that collects that object for her. It receives normal completion credit. |
| Fit picture | Return to the complete scene in one tap. |
| Larger previews | Enlarge object cards and labels without changing the objects or completion requirements. |

The exact outline remains visible until the object is found or the player dismisses it. Repeated hints remain available. Helpful text stays neutral: **Here’s a little help** or **Take your time**. There are no messages about failing, being slow, or using too much help.

The full target picture must match the object’s shape, color, and displayed orientation. If two similar objects appear, the name and preview must distinguish them clearly. The baseline game uses one unambiguous instance of each requested object; it does not ask the player to guess which identical cup counts.

## iPhone screens and controls

**Home.** A large **Continue** button returns to the most recently played unfinished scene. **Choose a scene** opens the complete catalog. **My album** shows completed scenes and favorites. A small settings button contains sound, motion, text size, and save backup controls. First launch begins at level 1 with a brief, dismissible explanation.

**Scene catalog.** Ten chapter groups contain ten numbered thumbnails each. Levels show **Not started**, **In progress**, or **Completed**. All thumbnails are selectable; there are no locks. The catalog supports favorites and remembers its scroll position.

**Playing screen.** A slim top bar contains Back, the level number, progress, and Settings. The artwork occupies the largest possible central area. The bottom tray shows four object cards at a comfortable phone width, with a sideways swipe for the remaining cards and an **All objects** sheet. A separate row contains Hint, zoom controls, and Fit picture. Controls respect the iPhone’s browser bars and home indicator.

**Completion.** The finished artwork remains visible. A short message says **All found. Nicely spotted.** The player chooses what happens next; the game does not automatically move her away from the picture.

Portrait is the primary layout. Landscape remains usable, with the tray moving beside the scene when that gives the artwork more room. The layout must work at 375 CSS pixels wide, including a small iPhone SE-sized viewport, without cutting off controls. Rotation or a changing browser toolbar must preserve progress and keep the currently inspected area visible.

Buttons have touch areas of at least 44 by 44 CSS pixels. Object hit areas extend modestly beyond their visible edges; nearby objects must remain distinguishable. At comfortable inspection zoom, each object needs a practical thumb-sized hit area. When a zoomed-out overlap is ambiguous, prefer the object actually touched, never award several objects from one tap. Every target must be reachable without placing a finger under a toolbar.

Pinch and drag operate within the scene. Plus, minus, and Fit picture provide alternatives to gestures. A small drag threshold and suppression of taps after a pinch prevent accidental guesses. Interface text remains scalable, controls have accessible labels, and found states use both a check mark and color. Reduced-motion settings replace animated zooms and sparkles with immediate changes. These features improve access, while the central search activity remains visual.

## Artwork and fair difficulty

Use original, richly illustrated scenes with coherent lighting and crisp object silhouettes. Favor warm interiors, colorful gardens, lived-in shops, coastal light, and a few whimsical settings. Avoid frightening imagery and gloomy scenes that become unreadable on a phone. Evening scenes should be well lit by their windows and lamps.

Each scene is a complete composition, framed for portrait play. Hidden objects belong visually in the scene, with a few playful surprises. Their scale, perspective, shadow, and texture should match their surroundings. The desired reaction is **Oh, there it is!**

- Difficulty comes from placement, clutter, orientation, and similar shapes. It does not come from reducing an object to a few pixels or making it almost transparent.

- At least 60 percent of each target’s silhouette, including its defining feature, remains visible. No target is fully hidden behind another object.

- All targets are present from the start and remain stationary. No opening drawers, solving locks, waiting for an animation, or hunting for an invisible hotspot is required.

- Color alone never distinguishes the correct object from a distractor. Use a difference in shape or markings as well.

- Spread targets across the picture. Do not stack several tiny targets in one crowded corner or place them beneath permanent interface controls.

- Review every target on an actual small iPhone at normal brightness. If recognition depends on seeing the original large artwork, revise the placement.

- Avoid identical non-target copies of a requested object. Reflections and printed motifs must not create a second equally valid answer.

Levels 1–10 introduce the controls and use 8–14 targets. Levels 11–30 gradually add overlapping outlines and richer arrangements. Later chapters mostly use 12–16 targets, with regular ten-object breathers. Later levels can be cleverer without becoming progressively more exhausting. Chapter finales are scenic rewards, not difficulty spikes.

Most scenes should contain several quick discoveries, a larger group needing inspection, and only a few especially clever placements. Initial pacing targets are 3–5 minutes for early scenes and 5–10 minutes for most later scenes. Roughly 8–12 hours for a first tour is a tuning goal, not a requirement or a time limit.

## The complete 100 level plan

Every numbered entry is a distinct authored scene. Recolors, mirrored pictures, and alternate target lists do not count as additional levels. The target count is the number needed for completion. The sample objects and placements below establish each scene’s identity; the remaining targets are chosen during detailed art production under the same fairness rules. Gentle levels deliberately lower the search burden.

### Chapter 1 A cozy start

Levels 1–10 teach the interaction through bright, familiar rooms. Objects begin clearly separated, then gradually overlap household details.

| Level | Scene | Targets | Sample objects and hiding approach |
| --- | --- | --- | --- |
| 1 | Morning kitchen | 8 | Striped mug, pear, teaspoon. Clear counter groupings introduce tapping and the object tray. |
| 2 | The reading nook | 8 | Bookmark, glasses, wool sock. An armchair, bookcase, and side table introduce scanning separate areas. |
| 3 | Breakfast by the window | 10 | Honey dipper, napkin ring, strawberry. Table settings introduce simple overlaps. |
| 4 | The sewing basket | 12 | Thimble, blue button, ribbon spool. Rounded supplies provide gentle shape confusion. |
| 5 | Sunny front porch | 8 | Garden glove, bird ornament, lemonade glass. Spacious composition gives an early breather. |
| 6 | Grandmother’s dresser | 12 | Brooch, perfume bottle, hair comb. Distinctive silhouettes sit among jewelry and folded fabric. |
| 7 | The pantry | 12 | Cinnamon stick, wooden scoop, jam spoon. Shelves introduce vertical searching. |
| 8 | An artist’s desk | 14 | Palette knife, eraser, paper crane. Similar tools require attention to their shapes. |
| 9 | Afternoon tea | 10 | Sugar tongs, lemon slice, pocket watch. A bright table balances the preceding detail. |
| 10 | The sunroom | 12 | Watering can, butterfly clip, knitted heart. Plants and furniture combine the chapter’s lessons. |

### Chapter 2 Gardens and green places

Levels 11–20 use leaves, tools, and natural patterns while retaining strong object outlines.

| Level | Scene | Targets | Sample objects and hiding approach |
| --- | --- | --- | --- |
| 11 | The potting bench | 10 | Trowel, plant label, twine spool. Tools nest among pots with readable handles. |
| 12 | Inside the greenhouse | 12 | Spray bottle, snail ornament, seed packet. Layered foliage frames clear inspection areas. |
| 13 | A rose arbor | 12 | Ribbon bow, butterfly brooch, pruning shears. Curved vines echo target shapes. |
| 14 | Vegetable patch | 14 | Carrot, garden fork, ladybird pin. Objects follow rows of plants and wooden edging. |
| 15 | The birdbath | 10 | Feather, acorn, toy boat. Open stone and water create a gentle scene. |
| 16 | Orchard picnic | 12 | Corkscrew, gingham napkin, apple charm. Basket weave and fabric supply moderate camouflage. |
| 17 | The garden shed | 14 | Padlock, paintbrush, measuring tape. Hanging tools encourage close inspection. |
| 18 | A pondside bridge | 14 | Dragonfly ornament, fishing float, leaf-shaped dish. Rails and reeds conceal distinct silhouettes. |
| 19 | Lavender courtyard | 10 | Soap bar, straw hat, sachet. Broad pale surfaces provide a breather. |
| 20 | Garden party | 12 | Cake server, paper fan, flower crown. A colorful celebration closes the chapter. |

### Chapter 3 The little shopping street

Levels 21–30 explore shops with different materials and display arrangements. The difficulty comes from plausible clutter.

| Level | Scene | Targets | Sample objects and hiding approach |
| --- | --- | --- | --- |
| 21 | The bakery | 12 | Whisk, pretzel, pastry brush. Curved pastries contrast with clearly shaped utensils. |
| 22 | The flower shop | 12 | Ribbon scissors, envelope, watering rose. Counter tools sit among stems and wrapping paper. |
| 23 | Secondhand bookshop | 14 | Magnifying glass, feather bookmark, brass key. Books create repeated lines around distinctive targets. |
| 24 | The antique window | 14 | Pocket compass, cameo, miniature horse. Rich textures introduce more demanding inspection. |
| 25 | The corner café | 10 | Coffee scoop, striped saucer, biscuit. A compact outdoor table provides relief. |
| 26 | The music shop | 14 | Guitar pick, tuning fork, harmonica. Instrument fittings echo small target shapes. |
| 27 | The toy shop | 14 | Spinning top, toy rocket, marbles pouch. Bright shapes keep a busy scene readable. |
| 28 | The haberdashery | 16 | Safety pin, measuring tape, tassel. Fabric folds and spools offer the chapter’s densest search. |
| 29 | The fruit stand | 10 | Shopping token, lemon squeezer, leaf brooch. Large produce shapes surround fewer targets. |
| 30 | Saturday market | 14 | Woven fan, honey jar, wooden bird. Several inviting stalls make a generous finale. |

### Chapter 4 By the sea

Levels 31–40 change the light and palette. Ropes, weathered wood, and collections of shells provide varied hiding structures.

| Level | Scene | Targets | Sample objects and hiding approach |
| --- | --- | --- | --- |
| 31 | The beach cottage | 12 | Sunglasses, shell dish, striped sock. Airy furniture and nautical decorations introduce the coast. |
| 32 | A tide pool | 14 | Star-shaped pendant, striped pebble, toy crab. Natural textures surround clearly distinct keepsakes. |
| 33 | The lighthouse room | 14 | Spyglass, brass whistle, folded map. Circular instruments and strong window light guide searching. |
| 34 | Fishing harbor | 16 | Float, red glove, bottle opener. Ropes and baskets create deliberate visual tangles. |
| 35 | A beach picnic | 10 | Sandwich wrap, kite handle, peach. A broad blanket offers a gentle pause. |
| 36 | The sailmaker’s loft | 14 | Sail needle, wooden shuttle, compass. Seams and rigging echo long thin tools. |
| 37 | The seaside kiosk | 14 | Postcard, ice-cream scoop, anchor charm. Distinct display racks divide the picture. |
| 38 | A ship’s cabin | 16 | Pipe, hourglass, brass bell. Warm wood and travel objects reward detailed inspection. |
| 39 | The shell collector | 12 | Sea-glass pendant, tiny vase, scallop spoon. A tidy display provides a calmer search. |
| 40 | Sunset boardwalk | 14 | Paper lantern, pinwheel, souvenir badge. Warm shop lights keep the evening scene legible. |

### Chapter 5 Country weekends

Levels 41–50 feature farm buildings, picnic spots, and rural craft. Spaces feel lived in without relying on excessive debris.

| Level | Scene | Targets | Sample objects and hiding approach |
| --- | --- | --- | --- |
| 41 | The farmhouse kitchen | 12 | Butter paddle, gingham mitt, egg cup. Rustic cooking equipment establishes a new material palette. |
| 42 | The red barn | 14 | Horseshoe, leather glove, apple. Wooden beams and hanging tack frame the targets. |
| 43 | The farm stand | 14 | Jam label, nutcracker, wicker star. Layered baskets introduce repeated curved outlines. |
| 44 | The old mill | 16 | Wooden gear, flour scoop, lantern. Machinery creates the chapter’s most intricate structure. |
| 45 | Picnic by the meadow | 10 | Thermos cup, daisy brooch, paperback. A simple cloth and grass make a gentle scene. |
| 46 | The beekeeping shed | 14 | Honey spoon, folded veil, flower button. Tools nest among jars and protective clothing. |
| 47 | The cheese cellar | 14 | Cheese knife, wax seal, pear charm. Warm, clear lighting preserves visibility on shelves. |
| 48 | The weaver’s room | 16 | Shuttle, wooden spindle, wool pompom. Repeated threads and wooden shapes reward careful scanning. |
| 49 | An apple cart | 12 | Ribbon rosette, cider mug, garden clip. Large fruit and open cart panels lower the burden. |
| 50 | Harvest supper | 14 | Corn husk doll, candle snuffer, pumpkin spoon. A plentiful table ends the chapter warmly. |

### Chapter 6 A leisurely journey

Levels 51–60 offer travel scenes without navigation puzzles. Signs and tickets are decoration, never tiny-text reading tests.

| Level | Scene | Targets | Sample objects and hiding approach |
| --- | --- | --- | --- |
| 51 | The station waiting room | 12 | Luggage tag, knitted mitten, folded newspaper. Benches and travel bags create clear search zones. |
| 52 | The vintage train | 14 | Ticket punch, enamel cup, spectacles. Seat upholstery echoes distinctive target markings. |
| 53 | The canal boat | 14 | Mooring hook, blue teapot, postcard. Compact shelving creates orderly visual density. |
| 54 | The hotel lobby | 16 | Desk bell, luggage key, fountain pen. Furniture and travel accessories support close inspection. |
| 55 | The mountain balcony | 10 | Binoculars, blanket clip, pinecone. Open scenery surrounds a few foreground objects. |
| 56 | The tram depot | 14 | Conductor’s cap, oilcan, brass token. Rails and equipment supply long and circular shapes. |
| 57 | The traveling trunk | 14 | Lace glove, folding fan, camera. Layered clothes conceal partial but recognizable outlines. |
| 58 | The mapmaker’s studio | 16 | Divider, wax stamp, miniature globe. Cartographic tools hide among curves and grid lines. |
| 59 | The lakeside pier | 12 | Life-ring keychain, thermos, paper boat. Broad boards and still water provide relief. |
| 60 | The hilltop inn | 14 | Door knocker, hiking badge, flower press. A welcoming entrance celebrates arrival. |

### Chapter 7 Rooms full of stories

Levels 61–70 mix collections and craftsmanship. Clear names distinguish unusual objects; the preview always supplies enough information.

| Level | Scene | Targets | Sample objects and hiding approach |
| --- | --- | --- | --- |
| 61 | The old library | 12 | Bookplate stamp, brass owl, tassel. Carved shelving and reading tables create varied search areas. |
| 62 | The natural history room | 14 | Ammonite, specimen brush, beetle brooch. Display trays contain distinct specimen shapes. |
| 63 | The clockmaker’s workshop | 14 | Winding key, pendulum weight, tweezers. Repeated metal curves provide controlled camouflage. |
| 64 | The theater dressing room | 16 | Mask, powder puff, feather fan. Fabric and costumes create rich but readable layering. |
| 65 | The ceramic studio | 10 | Potter’s rib, striped bowl, sponge. Broad pottery surfaces make a gentle interlude. |
| 66 | The conservatory classroom | 14 | Metronome, rosin box, sheet-music clip. Instruments provide recognizable outlines at different angles. |
| 67 | The photographer’s room | 14 | Lens cap, film reel, clothespin. Bright task lighting keeps photographic equipment visible. |
| 68 | The dollhouse workshop | 16 | Miniature chair, wood file, paint pot. Craft tools contrast with tiny but zoomable furniture. |
| 69 | The museum courtyard | 12 | Sketchbook, leaf pendant, water flask. Open paving gives room around each target. |
| 70 | The observatory | 14 | Star chart, lens brush, moon brooch. A warmly lit interior keeps the night theme comfortable. |

### Chapter 8 A little everyday magic

Levels 71–80 add whimsical settings while keeping the same familiar controls. Magic never introduces invisible objects or changing rules.

| Level | Scene | Targets | Sample objects and hiding approach |
| --- | --- | --- | --- |
| 71 | The woodland cottage | 12 | Acorn cup, knitted cap, wooden key. Domestic objects sit among roots and moss. |
| 72 | The mushroom village | 14 | Walnut basket, tiny lantern, leaf umbrella. Distinct shapes remain legible despite playful scale. |
| 73 | The storybook bakery | 14 | Star biscuit, silver whisk, candy-striped spoon. Curving architecture frames the kitchen objects. |
| 74 | The floating garden | 16 | Feather quill, glass watering bulb, wind chime. Layers of plants and suspended shelves enrich searching. |
| 75 | The wishing well | 10 | Wish ribbon, copper cup, carved dove. Broad stonework provides a gentle magical scene. |
| 76 | The fairy tailor | 14 | Thimble hat, silk bow, silver needle. Sewn textures echo recognizable household objects. |
| 77 | The enchanted book room | 14 | Dragon bookmark, candleholder, crystal ink bottle. Still, well-lit objects fill a fanciful reading space. |
| 78 | The cloud collector’s attic | 16 | Weather vane, glass jar, sun-shaped badge. Curved ornaments and beams create dense visual structure. |
| 79 | The moonlit tea table | 12 | Crescent spoon, sugar mouse, velvet pouch. A bright lamp protects readability against the night setting. |
| 80 | The lantern grove | 14 | Paper crane, bell ornament, flower comb. Warm lanterns conclude the chapter without moving targets. |

### Chapter 9 The turning seasons

Levels 81–90 vary weather, textiles, and festive decorations. Seasonal scenes are always available, regardless of the real date.

| Level | Scene | Targets | Sample objects and hiding approach |
| --- | --- | --- | --- |
| 81 | The autumn doorstep | 12 | Leaf wreath, garden snips, striped scarf. Warm foliage frames objects on steps and benches. |
| 82 | The pumpkin kitchen | 14 | Cookie cutter, nutmeg grater, oven mitt. Rounded produce contrasts with kitchen tools. |
| 83 | The costume cupboard | 14 | Velvet mask, star wand, buckle. Playful costumes supply folds and repeated decorative shapes. |
| 84 | The candle workshop | 16 | Wick trimmer, wax flower, brass mold. Shelves and work surfaces offer intricate arrangements. |
| 85 | A rainy window | 10 | Umbrella brooch, mug, wool slipper. A quiet interior supplies a gentle pause. |
| 86 | The winter cabin | 14 | Knitted mitten, pinecone ornament, matchbox. Firelight remains bright enough for comfortable searching. |
| 87 | The gift-wrapping table | 14 | Tape dispenser, ribbon curl, gift tag. Decorative paper creates pattern-based camouflage. |
| 88 | The holiday village | 16 | Toy sled, bell, star ornament. A tabletop miniature creates clearly bounded search areas. |
| 89 | The snowy garden bench | 12 | Red thermos, birdseed scoop, wool hat. Pale surroundings keep fewer targets easy to inspect. |
| 90 | The fireside armchair | 14 | Embroidery hoop, biscuit tin, wooden heart. A warm reading corner ends the chapter peacefully. |

### Chapter 10 Lovely things to come home to

Levels 91–100 celebrate everyday pleasures and bring the collection to a personal ending. The last scene is welcoming and deliberately gentle.

| Level | Scene | Targets | Sample objects and hiding approach |
| --- | --- | --- | --- |
| 91 | Sunday breakfast | 12 | Pancake turner, berry bowl, tiny vase. A bright dining-room table begins the final chapter. |
| 92 | The balcony garden | 14 | Bird feeder, plant mister, ribbon bookmark. Railings and flowering pots provide layered outlines. |
| 93 | The craft afternoon | 14 | Embroidery scissors, paper butterfly, crochet hook. Several crafts share a carefully organized tabletop. |
| 94 | The flea-market treasures | 16 | Cameo pin, brass compass, enamel bird. A new collection provides the final dense antiques scene. |
| 95 | The picnic basket | 10 | Cherry napkin, bottle stopper, daisy clip. A close view of a simple basket gives a breather. |
| 96 | The celebration table | 14 | Cake knife, candleholder, folded fan. Table decorations create an inviting, moderate search. |
| 97 | The memory shelf | 14 | Photo-corner packet, souvenir spoon, pressed flower. Keepsakes invite optional personal substitutions. |
| 98 | The rooftop supper | 16 | Citrus press, lantern hook, patterned coaster. Warm lighting defines an intricate outdoor table. |
| 99 | Welcome home | 12 | House key, bouquet ribbon, heart-shaped biscuit. A bright entryway settles the pace. |
| 100 | A table for two | 10 | Sealed note, flower pendant, small wooden heart. An intimate dinner scene ends with an optional personal message. |

## A fully specified example level

**Level 28, The haberdashery:** a warmly lit shop counter beneath shelves of fabrics, with a sewing chair at the left and hanging samples at the right. There are 16 required objects. The scene is detailed, but every object remains stationary and recognizable at inspection zoom.

| Object | Placement |
| --- | --- |
| Safety pin | Open on a blue fabric fold, with its clasp and curved end visible. |
| Measuring tape | Loosely coiled beside the counter’s front edge. |
| Tassel | Hanging among cords, distinguishable by its braided cap. |
| Thimble | Sitting on a pale satin ribbon, with its textured dome visible. |
| Wooden spool | Lying sideways beside larger ribbon reels; use a distinct hourglass profile. |
| Embroidery hoop | Resting against folded cloth on the lowest shelf. |
| Crochet hook | Placed diagonally across a closed pattern book. |
| Needle threader | On a dark felt square, large enough to recognize its wire loop when zoomed. |
| Pincushion | Nestled beside the sewing chair, with its round top unobscured. |
| Fabric shears | Resting on a striped swatch, with both handles and most of the blades visible. |
| Seam ripper | Beside a chalk holder, with the forked tip clearly visible. |
| Lace bow | Tied around a plain box near the window. |
| Metal zipper | Laid across a dark cloth sample so its pull and teeth remain distinct. |
| Flower button | On a folded linen square; its flower outline distinguishes it from ordinary buttons. |
| Knitting needle | Slanted beside the wool basket, with its end cap visible. |
| Tailor’s chalk | On a wooden ruler, using its distinctive triangular shape. |

For the safety pin, **Hint** circles the blue-fabric area. **Show me** moves to a useful zoom and outlines the pin itself. **Mark found** collects it if desired. The original picture remains intact after collection. No other open safety pin appears in this scene.

A completion message says **Every little detail found.** It then offers level 29, The fruit stand, as a gentler next scene.

## Progression and replay

The ten chapters provide a suggested tour. Completing a level adds its artwork to the album; completing all ten in a chapter adds a small postcard for that chapter. These are keepsakes, never resources to spend. Completing all 100 produces a simple celebration and leaves the entire catalog available.

Replay starts a fresh search of the chosen scene with the same fair, authored placements. The original completion status remains recorded. There is no promise of endlessly generated levels: the lasting content is 100 distinct scenes, plus the pleasure of revisiting favorites.

Level 100 can include a short dedication such as **Made for you, with love.** It appears when that scene is completed, even if other scenes remain unfinished. Personal details, such as a favorite flower, pet, or recognizable keepsake, can replace a few objects in levels 97–100 after those preferences are supplied. The default scenes work without any personal information.

## Saving and browser behavior

Open an ordinary HTTPS link in Safari and play immediately. Adding the game to the Home Screen is optional. The core game must work in the browser without an installation, account, or online game service.

Save each found object as it is collected, together with level progress, the current scene, viewing position, preferences, and favorites. After switching apps, locking the phone, reloading, or receiving a call, **Continue** returns to the same search. Moving between levels preserves every unfinished scene. Replaying a completed level stores the new attempt separately from the permanent completion record.

Progress is stored on the device. Browser storage can be removed by the user or evicted under browser storage policies, so provide **Back up progress** and **Restore progress** in Settings. A backup must be portable between devices and validated before replacing the current save. There is no automatic cross-device sync in this design. [MDN on browser storage and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).

Previously downloaded scenes should remain playable offline while their cached files remain available. Offer **Keep this chapter offline** with its download size and completion state; download the app shell, scene art, object previews, and required level data together. Do not show **Available offline** until all required files are present. The initial visit and uncached scenes require a connection. An interrupted download can resume, and a missing cached scene offers a retry without resetting progress. Offline operation requires explicit caching in the eventual web app. [MDN on offline web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation).

Load the current scene and, when appropriate, the next one, rather than decoding all 100 pictures at once. Proposed performance targets are a first playable scene within five seconds on a stable 10 Mbps connection, an initial download under 5 MB, individual compressed scene packages around 1–3 MB, and immediate visual feedback within 100 milliseconds of a valid tap. Smooth inspection matters more than decorative animation. These are targets to verify on the actual phone, not measured results.

A static web app is sufficient for this scope. Keep scene art and object definitions separate from the shared game rules so that all 100 levels behave consistently. No advertising, billing, or account systems are needed. Audio is optional and off on first use; sound preferences persist, and audio never blocks play.

## Artwork and level production

The main production effort is the artwork and its review. The catalog calls for **100 original scene compositions and 1,304 verified object placements**. Object types and background props may be reused where they fit, but the picture, arrangement, and search experience must feel distinct in every level. The 1,304 figure counts placements, not 1,304 different object types.

Each finished level needs the following content before it is ready for a build:

- A scene illustration and a catalog thumbnail, framed for the phone layout.

- The complete target list at the specified count, with clear names and exact matching preview images.

- A stable identifier and visible hit region for every object, aligned with the final art rather than an earlier draft.

- A broad hint region, exact reveal outline, and useful inspection view for each target.

- A target placement review for ambiguity, excessive occlusion, tiny details, nearby hit areas, and confusing non-target copies.

- A record of small-phone review and any art changes needed to make the search fair.

Create and review a small sample from the eventual catalog before commissioning the entire art set: level 1 for onboarding, level 28 for dense detail, and level 80 for a bright evening scene. Establish the visual style and touch comfort with those examples, then produce the remaining scenes in chapter batches. This is a recommended production sequence for a future build, not a reduction of the 100-level scope.

If generated artwork is used during production, inspect and correct every intended target. A plausible-looking image is insufficient if a listed object is malformed, missing, duplicated ambiguously, or impossible to identify. Target placement and hit regions remain deliberately authored; random placements are outside the initial design.

## Acceptance criteria for a future build

| Area | Required outcome |
| --- | --- |
| Complete content | Exactly 100 distinct scenes, numbered 1–100, with the catalog’s required target counts. |
| Free play | A fresh player can access and complete any level, use help repeatedly, and replay without ads, payment, a balance, or a waiting period. |
| Recognizable objects | Every target has a matching preview, sufficient visible shape, a fair hit area, and no indistinguishable non-target twin. |
| Help | Every unfound object supports a broad hint, an exact reveal, and an optional assisted find with ordinary completion credit. |
| Touch | Valid taps work near object edges; drags, pinches, tray swipes, and browser-toolbar changes do not accidentally collect targets. |
| Phone layout | All controls and targets remain reachable on a 375-pixel-wide viewport in portrait and in landscape. |
| Resume | Reloading or switching apps preserves found objects and returns to the saved scene. Leaving one unfinished level does not erase it. |
| Offline | Every chapter marked available offline can be played without a connection while cached; missing downloads explain the retry path without losing progress. |
| Backup | A valid exported save restores progress; an invalid backup is rejected without overwriting the current save. |
| Completion | Hints, assisted finds, missed taps, and breaks never reduce rewards or prevent completion. |
| Readability | Representative scenes pass review on the wife’s actual iPhone, including dense artwork and evening lighting. |
| Performance | Loading, tapping, and zooming meet the proposed budgets on the agreed test phone, or the assets and layout are revised. |

Review with the intended player should focus on three things: whether the pictures make her want to explore, whether a tap feels fair, and whether the clever objects feel satisfying when revealed. If she repeatedly finds an object but cannot select it, or sees the reveal and still cannot recognize it, the scene needs revision.
