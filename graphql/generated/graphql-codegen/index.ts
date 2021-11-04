/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query TestQuery {\n    user {\n      id\n      email\n    }\n  }\n": graphql.TestQueryDocument,
};

export function gql(source: "\n  query TestQuery {\n    user {\n      id\n      email\n    }\n  }\n"): (typeof documents)["\n  query TestQuery {\n    user {\n      id\n      email\n    }\n  }\n"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;