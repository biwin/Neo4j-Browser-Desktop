/**
 * Copyright (c) 2002-2014 "Neo Technology,"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.neo4j.cypher.internal.compiler.v2_1.ast.rewriters

import org.neo4j.cypher.internal.compiler.v2_1._
import org.neo4j.cypher.internal.commons.CypherFunSuite

class NamePatternElementTest extends CypherFunSuite {

  import parser.ParserFixture._

  test("name all NodePatterns in Query" ) {
    val original = parser.parse("MATCH (n)-[r:Foo]->() RETURN n")
    val expected = parser.parse("MATCH (n)-[r:Foo]->(`  UNNAMED20`) RETURN n")

    val result = original.rewrite(topDown(namePatternElements))
    assert(result === expected)
  }

  test("name all RelationshipPatterns in Query") {
    val original = parser.parse("MATCH (n)-[:Foo]->(m) WHERE (n)-[:Bar]->(m) RETURN n")
    val expected = parser.parse("MATCH (n)-[`  UNNAMED9`:Foo]->(m) WHERE (n)-[`  UNNAMED31`:Bar]->(m) RETURN n")

    val result = original.rewrite(bottomUp(namePatternElements))
    assert(result === expected)
  }

}