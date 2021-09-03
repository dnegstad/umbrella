import type { IObjectOf } from "@thi.ng/api";
import { idgen } from "@thi.ng/idgen";
import { tableKeys } from "@thi.ng/markdown-table";
import { Z3 } from "@thi.ng/strings";
import {
    comp,
    filter,
    map,
    mapKeys,
    push,
    transduce,
} from "@thi.ng/transducers";
import { existsSync, readdirSync, writeFileSync } from "fs";
import { META_FIELD } from "./api";
import { initConfig } from "./config";
import { readJSON } from "./io";
import { thumb } from "./partials/asset";

interface Example extends IObjectOf<string> {
    id: string;
    img: string;
    name: string;
    description: string;
}

try {
    initConfig("./tools/config.json", "./package.json");

    const counter = idgen(8);
    const examples = transduce(
        comp(
            map((f) => `examples/${f}/package.json`),
            filter(existsSync),
            map((f) => readJSON(<string>f)),
            filter((pkg) => !pkg[META_FIELD]?.skip),
            mapKeys(
                {
                    id: () => Z3(counter.next() + 1),
                    name: (id) => `[${id}](./${id}/)`,
                    img: (_, ex) =>
                        ex[META_FIELD]?.screenshot
                            ? thumb(ex["thi.ng"].screenshot, "../assets")
                            : "",
                    description: (desc) => desc || "TODO",
                },
                false
            )
        ),
        push<Example>(),
        readdirSync("examples")
    );

    const BODY = `<!-- This file is autogenerated - DO NOT EDIT! -->
# @thi.ng/umbrella examples

This directory contains a growing number (currently ${
        examples.length
    }) of standalone
example projects, including live online versions, build instructions
and commented source code.

If you want to [contribute](../CONTRIBUTING.md) an example, please get
in touch via PR, issue tracker, email or twitter!

${tableKeys(
    ["#", "Screenshot", "Name", "Description"],
    ["id", "img", "name", "description"],
    examples
)}
`;
    writeFileSync("examples/README.md", BODY);
} catch (e) {
    console.log((<Error>e).message);
    process.exit(1);
}
