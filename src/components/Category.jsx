import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { Item } from './Item';
import { Options } from './Options';

export class Category extends React.Component {
    render() {
        let items = (this.props.isHomeCategory(this.props.category.id) ? this.props.items.filter((item) => {
            return (this.props.useHDR || item.fileExt !== 'hdr');
        }) : this.props.getItemsInCategory(this.props.category.id)).filter((item) => {
            return (
                (this.props.query.onlyFree === false || item.isFree) &&
                (this.props.query.onlyRecent === false || this.props.isItemRecent(item)) &&
                (
                    this.props.query.searchTerm === "" ||
                    item.title.toUpperCase().includes(this.props.query.searchTerm.toUpperCase()) ||
                    this.props.searchArray(item.tags, this.props.query.searchTerm)
                ) &&
                (this.props.useHDR || item.fileExt !== 'hdr')
            );
        });

        if (this.props.isHomeCategory(this.props.category.id)) {
            let recentItems = this.props.items.filter((item) => {
                return (
                    this.props.query.searchTerm === "" ||
                    item.title.toUpperCase().includes(this.props.query.searchTerm.toUpperCase()) ||
                    this.props.searchArray(item.tags, this.props.query.searchTerm)
                ) && !this.props.searchArray(item.tags, 'home');
            });
            this.props.sortItems(recentItems, "Date Uploaded (New to Old)");
            let homeItems = this.props.items.filter((item) => {
                return (
                    this.props.query.searchTerm === "" ||
                    item.title.toUpperCase().includes(this.props.query.searchTerm.toUpperCase()) ||
                    this.props.searchArray(item.tags, this.props.query.searchTerm)
                ) && this.props.searchArray(item.tags, 'home');
            });

            let finalItems = [...recentItems.slice(0, 1000), ...homeItems.slice(0, 1000)]
                .map(item => ({ item, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ item }) => item);

            items = [...finalItems].slice(0, 1000);
        }

        this.props.sortItems(items, this.props.query.sortBy);

        let itemsBegin = this.props.categoriesLength === 1 || this.props.category.id === this.props.getHomeCategory() ? this.props.query.pageIndex * this.props.query.pageSize : 0;
        let itemsEnd = this.props.categoriesLength === 1 || this.props.category.id === this.props.getHomeCategory() ? itemsBegin + this.props.query.pageSize : 25;
        let itemsLength = items.length;
        let pageBack = this.props.query.pageIndex - 1 > 0 ? this.props.query.pageIndex - 1 : 0;
        let pageNext = this.props.calculateNextPage(this.props.query.pageIndex, this.props.query.pageSize, itemsLength);

        window.currentCategory = this.props.category;
        window.itemsInCurrentCategory = items;

        const usingAdminMode = true;

        return (
            <React.Fragment>
                <Row className="ml-1 mb-4 mt-4">
                    <Col>
                        <Options
                            upper={true}
                            query={this.props.query}
                            category={this.props.category}
                            categories={this.props.categories}
                            items={this.props.items}
                            pageBack={pageBack}
                            pageNext={pageNext}
                            itemsBegin={itemsBegin}
                            itemsEnd={itemsEnd}
                            itemsLength={itemsLength}
                            isHomeCategory={this.props.isHomeCategory}
                            isPrimaryCategory={this.props.isPrimaryCategory}
                            selectAllItemsInCategory={this.props.selectAllItemsInCategory}
                            updateFromOptions={this.props.updateFromOptions}
                            handleClearFavoritesClick={this.props.handleClearFavoritesClick}
                            handleDownloadClick={this.props.handleDownloadClick}
                            handleFavoriteClick={this.props.handleFavoriteClick}
                            getRecentDownloadedCategoryId={this.props.getRecentDownloadedCategoryId}
                            getMyFavoritesCategoryId={this.props.getMyFavoritesCategoryId}
                            {...this.props}
                        />
                    </Col>
                </Row>
                <Row className="ml-1">
                    {
                        usingAdminMode === true ? (
                            <React.Fragment>
                                <Col>
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '200px auto auto 50px',
                                            justifyContent: 'stretch'
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontWeight: 'bold',
                                                color: '#c3c3c3',
                                                paddingLeft: 10
                                            }}
                                        >
                                            Item
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: 'bold',
                                                color: '#c3c3c3',
                                                paddingLeft: 10
                                            }}
                                        >
                                            Title
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: 'bold',
                                                color: '#c3c3c3',
                                                paddingLeft: 10
                                            }}
                                        >
                                            Tags
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: 'bold',
                                                color: '#c3c3c3',
                                                paddingLeft: 10
                                            }}
                                        >
                                            Free
                                        </span>
                                    </div>
                                    {
                                        items.slice(itemsBegin, itemsEnd).map((item, index) => {
                                            return (
                                                <div
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '200px auto auto 50px',
                                                        justifyContent: 'stretch'
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            border: '1px solid #f1f1f1',
                                                            padding: 10
                                                        }}
                                                    >
                                                        <img
                                                            src={`https://v3.pdm-plants-textures.com/images/files/${item.hash.substring(0, 2)}/${item.hash}.${item.thumbnailExt}`}
                                                            alt=""
                                                            style={{ height: 60 }}
                                                        />
                                                    </span>
                                                    <textarea
                                                        style={{
                                                            padding: 7.5,
                                                            border: '1px solid #f1f1f1'
                                                        }}
                                                        defaultValue={item.title}
                                                    />
                                                    <textarea
                                                        style={{
                                                            padding: 7.5,
                                                            border: '1px solid #f1f1f1'
                                                        }}
                                                        defaultValue={item.tags.toString()}
                                                    />
                                                    <span
                                                        style={{
                                                            border: '1px solid #f1f1f1',
                                                            display: 'grid',
                                                            justifyContent: 'center',
                                                            alignContent: 'center'
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            defaultChecked={item.isFree}
                                                            style={{
                                                                width: 20,
                                                                height: 20
                                                            }}
                                                        />
                                                    </span>
                                                </div>
                                            )
                                        })
                                    }
                                </Col>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {
                                    items.slice(itemsBegin, itemsEnd).map((item, index) => {
                                        return (
                                            <Col
                                                key={index}
                                                xl={1} lg={2} md={3} sm={4} xs={6}
                                                style={{
                                                    minWidth: 160
                                                }}
                                            >
                                                <Item
                                                    license={this.props.license}
                                                    item={item}
                                                    user={this.props.user}
                                                    category={this.props.category}
                                                    isHomeCategory={this.props.isHomeCategory}
                                                    calculatePathToItem={this.props.calculatePathToItem}
                                                    handleDownloadClick={this.props.handleDownloadClick}
                                                    handleFavoriteClick={this.props.handleFavoriteClick}
                                                    isItemFavorite={this.props.isItemFavorite}
                                                    formatFileSize={this.props.formatFileSize}
                                                    selectedAction={this.props.selectedAction}
                                                    updateSelectedAction={this.props.updateSelectedAction}
                                                    selectedItems={this.props.selectedItems}
                                                    updateSelectedItems={this.props.updateSelectedItems}
                                                />
                                            </Col>
                                        )
                                    })
                                }
                            </React.Fragment>
                        )
                    }
                </Row>
                <Row className="ml-1 mb-4">
                    <Col>
                        <Options
                            upper={false}
                            query={this.props.query}
                            pageBack={pageBack}
                            pageNext={pageNext}
                            itemsBegin={itemsBegin}
                            itemsEnd={itemsEnd}
                            itemsLength={itemsLength}
                            handleDownloadClick={this.props.handleDownloadClick}
                            handleFavoriteClick={this.props.handleFavoriteClick}
                            getRecentDownloadedCategoryId={this.props.getRecentDownloadedCategoryId}
                            getMyFavoritesCategoryId={this.props.getMyFavoritesCategoryId}
                            {...this.props}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}