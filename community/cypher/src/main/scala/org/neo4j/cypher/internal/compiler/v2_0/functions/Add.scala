/**
 * Copyright (c) 2002-2013 "Neo Technology,"
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
package org.neo4j.cypher.internal.compiler.v2_0.functions

import org.neo4j.cypher.internal.compiler.v2_0._
import org.neo4j.cypher.internal.compiler.v2_0.symbols._
import org.neo4j.cypher.internal.compiler.v2_0.commands.{expressions => commandexpressions}

case object Add extends Function {
  def name = "+"

  def semanticCheck(ctx: ast.Expression.SemanticContext, invocation: ast.FunctionInvocation) : SemanticCheck =
    checkMinArgs(invocation, 1) then checkMaxArgs(invocation, 2) then
    when(invocation.arguments.length == 1) {
      invocation.arguments.constrainType(NumberType())
      invocation.specifyType(NumberType())
    } then when(invocation.arguments.length == 2) {
      invocation.arguments.constrainType(StringType(), NumberType(), CollectionType(AnyType())) then
      invocation.specifyType(invocation.arguments.mergeDownTypes)
    }

  def toCommand(invocation: ast.FunctionInvocation) = {
    if (invocation.arguments.length == 1) {
      invocation.arguments(0).toCommand
    } else {
      val left = invocation.arguments(0)
      val right = invocation.arguments(1)
      commandexpressions.Add(left.toCommand, right.toCommand)
    }
  }
}
