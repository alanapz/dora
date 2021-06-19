import { EMPTY, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { nonNull } from "src/utils/check";
import { multiFork } from "src/utils/multifork";
import { utils } from "src/utils/utils";

type QuickTableButtonType = 'primary' | 'danger' | 'success' | 'warning';

interface QuickTableActionInput<T> {
  label: string;
  type?: QuickTableButtonType;
  icon: string;
  enabled?: (item: T) => boolean | undefined;
  invoker?: (item: T) => Observable<void>;
}

export class QuickTableSelect<T> {

  private readonly _selected = new Set<T>();

  private readonly _actions: QuickTableAction<T>[] = [];

  constructor(private readonly callback: () => T[]) {
    nonNull(callback, "callback");
  }

  addAction(action: QuickTableActionInput<T>): QuickTableSelect<T> {
    this._actions.push(new QuickTableAction(
      this,
      action.label,
      action.type || 'primary',
      action.icon,
      action.enabled || (() => true),
      action.invoker || (() => EMPTY)));
    return this;
  }

  get actions(): QuickTableAction<T>[] {
    return this._actions;
  }

  isSelected(object: T): boolean {
    return this._selected.has(object);
  }

  get selected(): T[] {
    return this.callback().filter(item => this._selected.has(item));
  }

  toggleObject(object: T) {
    this.selectObject(object, !this._selected.has(object));
  }

  selectObject(object: T, selected: boolean) {
    if (selected) {
      this._selected.add(object);
    }
    else {
      this._selected.delete(object);
    }
  }

  toggleAll() {
    const current = this.isAllSelected();
    this.callback().forEach(item => this.selectObject(item, !current));
  }

  isAnySelected(): boolean {
    return this.callback().some(item => this._selected.has(item));
  }

  isAllSelected(): boolean {
    return this.callback().every(item => this._selected.has(item));
  }
}

export class QuickTableAction<T> {

  constructor(
    private readonly table: QuickTableSelect<T>,
    readonly label: string,
    readonly type: QuickTableButtonType,
    readonly icon: string,
    private readonly enabled: (item: T) => boolean | undefined,
    private readonly invoker: (item: T) => Observable<void>) {
  }

  get anyEnabled(): boolean {
    return this.enabledCount > 0;
  }

  get enabledCount(): number {
    return this.table.selected.filter(item => !! this.enabled(item)).length;
  }

  isEnabledFor(item: T): boolean {
    return !! this.enabled(item);
  }

  invokeSingle(item: T): void {
    this.invoker(item).subscribe(utils.subscriber());
  }

  invokeAll(): void {
    multiFork(environment.concurrency, this.table.selected.map(item => this.invoker(item))).subscribe(utils.subscriber());
  }
}
