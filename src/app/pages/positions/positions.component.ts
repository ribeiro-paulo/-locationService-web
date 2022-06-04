import { Component, OnInit } from '@angular/core';
import { Poi } from 'src/app/models/poi';
import { Position } from 'src/app/models/position';
import { BoardService } from 'src/app/services/board/board.service';
import { PosService } from 'src/app/services/pois/pois.service';
import { PositionService } from 'src/app/services/position/position.service';
import * as moment from 'moment';
import 'moment-duration-format';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit {

  displayedColumns: string[] = ['poi', 'start', 'end', 'time'];
  board: string = '';
  date: Date | undefined;
  boards: string[] = [];
  positionsBoards: any[] = [];
  pois: Poi[] = [];

  constructor(
    private posicaoService: PositionService,
    private poisService: PosService,
    private BoardService: BoardService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.loaderService.isLoading.next(true);
    this.loadPois();
    this.loadBoard();
  }

  loadPois() {
    this.poisService.getPois().subscribe(res => this.pois = res);
  }

  loadBoard() {
    this.BoardService.getBoards().subscribe(res => {
      this.boards = res;
      this.loadPositions();
    });
  }

  loadPositions() {
    this.loaderService.isLoading.next(true);
    this.posicaoService.getPositions(this.board, this.date).subscribe(res => {
      this.boards.forEach(board => {
        this.positionsBoards.push({
          placa: board,
          positions: this.filterPositions(res.filter(position => position.placa === board))
        });
      });
      this.loaderService.isLoading.next(false);
    });
  }

  filterPositions(positions: Position[]) {
    var ppList: any[] = []
    this.pois.forEach(poi => {
      var positionsAux: Position[] = [];
      positions.forEach((pos: Position, i: number) => {
        const overPoint = this.overPoint(pos, poi);
        const lastItem = i + 1 === positions.length
        if (overPoint && !lastItem) {
          positionsAux.push(pos);
        } else if (positionsAux.length !== 0) {
          this.addPP(ppList, poi.nome, positionsAux);
          positionsAux = [];
        }
      });
    });
    return ppList
  }

  search() {
    this.positionsBoards = [];
    this.loadPositions();
  }

  addPP(ppList: any[], poiName: string, posicoes: Position[]) {
    const start = posicoes[0].data
    const end = posicoes[posicoes.length - 1].data
    ppList.push({
      poi: poiName,
      start: start,
      end: end,
      time: this.time(start, end),
      posicoes: posicoes
    });
  }

  overPoint(pos: Position, poi: Poi) {
    const { latitude: latPos, longitude: longPos } = pos
    const { latitude: latPoi, longitude: longPoi, raio } = poi

    let distancia = 6378140 * Math.acos(
      Math.cos(this.toRad(90 - latPos))
      * Math.cos(this.toRad(90 - latPoi))
      + Math.sin(this.toRad(90 - latPos))
      * Math.sin(this.toRad(90 - latPoi))
      * Math.cos(this.toRad(longPoi - longPos))
    );
    return distancia <= raio;
  }

  toRad(degrees: number) {
    return degrees * Math.PI / 180;
  }

  time(start: Date, end: Date) {
    const startTime = moment(start)
    const endTime = moment(end)
    const duration = moment.duration(endTime.diff(startTime));
    return duration.format("D[d], H[h e] m[m]")
  }
}
