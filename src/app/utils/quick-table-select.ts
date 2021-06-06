import { nonNull } from "src/utils/check";

export class QuickTableSelect<T> {

  private readonly selected = new Set<T>();

  constructor(private readonly callback: () => T[]) {
    nonNull(callback, "callback");
  }

  isSelected(object: T): boolean {
    return this.selected.has(object);
  }

  toggleObject(object: T) {
    this.selectObject(object, !this.selected.has(object));
  }

  selectObject(object: T, selected: boolean) {
    if (selected) {
      this.selected.add(object);
    }
    else {
      this.selected.delete(object);
    }
  }

  toggleAll() {
    const current = this.isAllSelected();
    this.callback().forEach(item => this.selectObject(item, !current));
  }

  isAnySelected(): boolean {
    return this.callback().some(item => this.selected.has(item));
  }

  isAllSelected(): boolean {
    return this.callback().every(item => this.selected.has(item));
  }
}
