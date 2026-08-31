06 — Findings

What I would fix first.
Ordered by severity. Nothing here is invented for thoroughness — if the chassis is clean, the remaining issues are the ones that still change how a pilgrim feels.

01

High

St Mary of the Angels

Hover lies on dead cards
card-lift (translateY + shadow + gold border) is the site’s “this is a link” signal. It is attached to Give options, Serve roles, devotion cards, About pillars, priest cards, NewsEvents, and Home featured events — none of which navigate. Round 7 named this R7-8 on the sister port and fixed it with card-tint.

02

Medium

St Mary of the Angels

PageHero smokes the interiors
Interior photography sits at opacity-35 under a heavy maroon gradient. Give and FAQ open on the same near-black field. The WOHA building is a house of light; the interior templates do not admit it.

03

Medium

St Mary of the Angels

Reveal can hide print content
.reveal defaults to opacity 0. There is no @media print override and no IntersectionObserver constructor guard. Below-fold History, Give, and Ministries content can be blank in print or capture contexts.

04

Low

St Mary of the Angels

Active nav is color only
Desktop current-route state is gold text. The footer already draws a gold underline. The header does not, so wayfinding is weaker at the place it matters most.

05

Low

Church of the Risen Christ

A port still wearing another parish’s coat
Tokens, motion names (shrine-*), and the cream-maroon-gold liturgical editorial system were inherited wholesale. The Easter identity is carried by copy and photography, not by a palette or emblem of its own. Distinctiveness is literary, not chromatic.

06

Informational

Both

CSP and host headers diverge
St Mary’s live CSP still allowlists images.pexels.com and upload.wikimedia.org (unused). Risen tightened img-src to 'self' data blob. Neither live host currently serves the public/_headers HSTS set — a documented ops gap, not a visual one.
