import type { ReactElement } from 'react';

export interface AppPageProps {
  path: string;
  element: ReactElement;
}

export class AppPage {
  public readonly path: string;
  public readonly element: ReactElement;

  constructor(props: AppPageProps) {
    this.path = props.path;
    this.element = props.element;
  }
}
