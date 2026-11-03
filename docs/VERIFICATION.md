# Three-sample release verification

Generated 2026-11-03T07:20:58.559Z. Revision 3 has **53 scenes / 702 placements**, maximum 15 targets. Fifty original retained scenes are unchanged; three new twelve-object samples replace the entire rejected fifty-scene revision-2 batch. A [comparison against the previous release](verification-v3/retained-content.json) confirms all 866 retained source, annotation, scene, thumbnail and preview files are byte-identical. The earlier automatic checks did not establish player acceptance: the player subsequently rejected those pictures and their cutout previews.

All three new illustrations and all 36 target previews/contours were inspected. Samples use tight unmasked source crops, validated byte-for-byte against the finished PNGs; contours no longer determine the preview silhouette. They aim for only a modest increase over current level 24 through placement and small overlaps. Their actual clarity and difficulty still require intended-player feedback. No new fifty-scene batch has been produced.

- 24 core tests passed.
- 28 browser scenarios passed; 0 failed; 0 skipped.
- Both desktop engines collected all 702 placements in all 53 scenes through the real picker.
- Checks cover duplicate taps, help/reveals/assists, replay, album/postcards, backups/rejection, one-time old-save migration, retained level-24 finds and no rejected credit on sample 51.
- Both engines downloaded the complete three-sample chapter, opened every sample/preview offline and retained finds after offline reload. Ten-scene downloads, interrupted resume and missing-file repair also passed.
- Compact portrait 375×568 and landscape 667×375 keep the horizontal bottom tray and reachable 44px controls.

The initial cached-tab test still expected save version 2. After correcting that obsolete assertion to version 3, both engine reruns passed. Raw reports retain the initial run and the corrected rerun; the case summary uses the latest result for each scenario.

Aggregate 10 Mbps / 40 ms emulated loading: chromium-phone: 2188ms, 1,162,450 response payload bytes; webkit-phone: 2452ms, 1,369,167 response payload bytes. This counts page, Pixi worker and service-worker traffic. Touch-to-counter feedback: chromium-phone: 3.8ms; webkit-phone: 4.0ms. These are desktop measurements, **not physical iPhone tests**.

The local production ZIP contains 53 scene images, 702 matching previews and 53 versioned level packages. It is 40.0 MB. [Evidence, metrics and cases](verification-v3/results.json) · [ZIP checksum/counts](verification-v3/static-archive.json). Original and rejected revision-2 evidence remain historical; they are not current acceptance results.

Local checks/build are complete; publication evidence will be recorded after deployment.

Reload Safari after publication. Retained discoveries migrate automatically; old raw saves remain available as recovery, and rejected pictures never grant sample credit. Offline chapter downloads should be repeated for the updated collection. Actual iPhone testing and intended-player sample feedback remain pending; see [device review](DEVICE_REVIEW.md).
