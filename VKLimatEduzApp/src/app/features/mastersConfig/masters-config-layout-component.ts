import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-masters-config-layout-component',
  imports: [RouterOutlet],
  templateUrl: './masters-config-layout-component.html',
  styleUrl: './masters-config-layout-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MastersConfigLayoutComponent {

}
